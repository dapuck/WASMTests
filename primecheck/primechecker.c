//#include <gmp.h>
#include <stdlib.h>
#include <math.h>

int simple_primecheck_fermat(long num, int k) {
    // mpz_t numToCheck, twidle, uno;
    // mpz_init(numToCheck);
    // mpz_init(twidle);
    // mpz_init(uno);
    // mpz_set_ui(uno, 1);
    // mpz_set_str(numToCheck, num, 0);
    k = (k > 0) ? k : 2;
    // if num < 2 then ret false
    // if(mpz_cmp_ui(numToCheck, 2) == -1) {
    if(num < 2) {
        return 0;
    }
    // if num == 2 or 3 then ret true
    // if(mpz_cmp_ui(numToCheck, 3) < 1) {
    if(num <= 3) {
        return 1;
    }
    // if (num & 1) != 1 then ret false (even)
    // mpz_and(twidle, numToCheck, uno);
    // if(mpz_cmp(twidle, uno) != 0) {
    if((num & 1) != 1) {
        return 0;
    }
    // do k times
    //  a := (rand < num-2) + 1
    //  if pow(a, num-1, num) != 1 then ret false
    // gmp_randstate_t state;
    // gmp_randinit_default(state);
    // while (k > 0) {
    //     mpz_t a;
    //     mpz_urandomm(a, state, numToCheck);
    //     k--;
    // }
    while(k > 0) {
        long r = random();
        if(r < (num - 2)) {
            r += 1;
        }
    }
    // ret true
    return 1;
}
