export const getRandomNumber = () => {
    const minm = 100000;
    const maxm = 999999;

    return Math.floor(Math.random() * (maxm - minm + 1)) + minm;
}

export const get13DigitNumber = () => {
    const minm = 1000000000000;
    const maxm = 9999999999999;

    return Math.floor(Math.random() * (maxm - minm + 1)) + minm;
}
