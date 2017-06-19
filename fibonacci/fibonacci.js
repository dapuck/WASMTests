/* */
(function() {

    function fib(x) {
        if (x === 0) {
            return 0;
        }
        if (x === 1) {
            return 1;
        }
        return fib(x - 1) + fib(x - 2);
    }

    if(typeof window !== 'undefined') {
        window.fib = fib;
        return;
    }
    if(typeof module !== 'undefined') {
        module.exports = {
            "fib": fib
        };
    }
})();