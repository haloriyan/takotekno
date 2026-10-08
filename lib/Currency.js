const Currency = (amount) => {
    let props = {};
    props.encode = (prefix = 'Rp', thousand_separator = ".") => {
        let result = '';
        if (typeof amount === 'undefined') {
            amount = 0;
        }
        
        let amountRev = amount.toString().split('').reverse().join('');
        for (let i = 0; i < amountRev.length; i++) {
            if (i % 3 === 0) {
                result += amountRev.substr(i,3)+'.';
            }
        }
        return prefix + ' ' + result.split('',result.length-1).reverse().join('');
    }
    props.decode = () => {
        return parseInt(amount.replace(/,.*|[^0-9]/g, ''), 10);
    }

    return props;
}

export default Currency;