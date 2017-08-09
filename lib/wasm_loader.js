(function() {
    // window.Module = window.Module || {};
    window.WASMLoader = window.WASMLoader || { Instances: {}, Modules: {} };
    // get wasm
    function loadWASM(file) {
        return fetch(file)
        .then(response => {
            if(!response.ok) {
                throw "Issue loading " + file;
            }
            return response.arrayBuffer();
        });
    }

    let t0 = performance.now();
    let wasmPath = document.currentScript && document.currentScript.dataset.wasm;
    let wasmName = document.currentScript && document.currentScript.dataset.wasmName;
    let callback = document.currentScript && document.currentScript.dataset.callback;
    if(!wasmPath) {
        return;
    }
    if(!wasmName) {
        wasmName = wasmPath.replace(/^.*?([^\/]*?)\.wasm.*$/,"$1");
    }
    loadWASM(wasmPath)
    .then(binary => {
        return new WebAssembly.Module(binary);
    })
    .then(module => {
        let imports = {
            "env" : {
                "memoryBase": 0,
                "tableBase": 0,
                "memory": new WebAssembly.Memory({ initial: 256 }),
                "table": new WebAssembly.Table({ initial: 0, element: 'anyfunc' })
            }
        };
        WebAssembly.Module.imports(module).forEach(function(el) {
            if(!imports[el.module]) {
                imports[el.module] = {};
            }
            if(el.kind === 'function') {
                imports[el.module][el.name] = function () {
                    console.log("");
                };
            }
        }, this);
        let instance = new WebAssembly.Instance(module,imports);
        window.WASMLoader.Instances[wasmName] = instance;
        let t1 = performance.now();
        console.log(`Initalized: ${t1 - t0}ms`);
        // console.log(instance.exports);
        window.WASMLoader.Modules[wasmName] = {};
        let Module = window.WASMLoader.Modules[wasmName];
        for(let k in instance.exports) {
            if(/^_[a-z]/i.test(k)) {
                Module[k.replace(/^_/,"")] = instance.exports[k];
            }
        }
        // window.Module.fib = instance.exports._fib;
        // if(typeof Module.onRuntimeInitialized === 'function') {
        //     Module.onRuntimeInitialized();
        // }
        if(callback) {
            if(typeof callback === 'function') {
                return callback(Module, instance);
            }
            let cb = eval(callback);
            if(typeof cb === 'function') {
                return cb(Module,instance);
            }
        }
    });
})();
