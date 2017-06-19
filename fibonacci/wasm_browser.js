(function() {
    window.Module = window.Module || {};
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
    loadWASM("./fibonacci_wasm2.wasm")
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
        window.fibWasmInst = instance;
        let t1 = performance.now();
        console.log(`Initalized: ${t1 - t0}ms`);
        // console.log(instance.exports);
        for(let k in instance.exports) {
            if(/^_[a-z]/i.test(k)) {
                window.Module[k.replace(/^_/,"")] = instance.exports[k];
            }
        }
        // window.Module.fib = instance.exports._fib;
        if(typeof Module.onRuntimeInitialized === 'function') {
            Module.onRuntimeInitialized();
        }
    });
})();