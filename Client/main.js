let signIn = document.querySelector('button');

function processForm () {
    let inputs = document.querySelectorAll('input');
    let result = {};

    inputs.forEach( function(item){

        if(item.tagName.toLowerCase() != 'button') {
            result[item.name] = item.value;
        }
    });

    return result;
}

function sendAjax ({method, url, data}) {

    return new Promise ((resolve, reject) => {
        let xhr = new XMLHttpRequest();

        xhr.addEventListener('load', function({target}) {
            
            if(target.status === 200) {
                const result = JSON.parse(target.response);

                console.log(result, 'result');

                resolve(result);
            }
        });

        xhr.open(method, url);

        if (method.toLowerCase() === 'post') {
            xhr.send(JSON.stringify(data));
        } else {
            xhr.send();
        }
        
    });
    
}

signIn.addEventListener('click', function (event) {
    event.preventDefault();

    const requestPayload = processForm();

    sendAjax({
        method: "post",
        url: "http://localhost:3000/",
        data: requestPayload,
    })
    .then((id) => {
        let url = new URL ('getGoodsById', 'http://localhost:3000/');

        let goods = sendAjax({
            method: "post",
            url: url.href,
            data: id
        });

        return Promise.resolve(goods);

    })
    .then((goods) => {
        let form = document.querySelector('form');
        form.style.display = 'none';
        console.log(form, 'form')
        console.log(goods, 'goods');

        function Component() {
            this.data = goods;
            this.goodsById = null;
        }

        Component.prototype.makeItems = function () {
            let fragment = document.createDocumentFragment();
            let h2 = document.createElement('h2');
            let p = document.createElement('p');
            let span = document.createElement('span');
            let img = document.createElement('img');

            h2.innerText = this.data[0].product;
            span.innerText = `price: ${this.data[2].price}`;
            p.innerText = this.data[4].details.join(',');
            img.src = this.data[1].img;

            let data = [h2, p,img, span];
            data.forEach( item => fragment.append(item));

            return fragment;
        }

        Component.prototype.makeGoods = function () {
            let items = this.makeItems();
            let section = document.createElement('section');
            section.classList.add('goods-container');
            
            section.append(items);
            this.goodsById = section;

            return this;
        }

        Component.prototype.render = function (selector) {
            document.querySelector(selector).append(this.goodsById);
        }

        let goodsById = new Component(goods);
        goodsById
                .makeGoods()
                .render('body');
    })
});

//---------------------------------------------

// function sendAjax ({method, url, data, success}) {

//     let xhr = new XMLHttpRequest();

//     xhr.addEventListener('load', function({target}) {
        
//         if(target.status === 200) {
//             const result = JSON.parse(target.response);
//             success(result);
//             // success(id);
//             // send second Ajax with id;
//             console.log(result, 'id');
//         }
//     });

//     xhr.open(method, url);

//     if (method.toLowerCase() === 'post') {
//         xhr.send(JSON.stringify(data));
//     } else {
//         xhr.send();
//     }
 
// }

// signIn.addEventListener('click', function (event) {
//     event.preventDefault();

//     const requestPayload = processForm();

//     let url = new URL ('getGoodsById', 'http://localhost:3000/');

//     sendAjax({
//         method: "post",
//         url: "http://localhost:3000/",
//         data: requestPayload,
//         success(id){

//             sendAjax({
//                 method: "post",
//                 url: url.href,
//                 data: id,
//                 success(result) {
//                     return result;
//                 }
//             })
//         }
//     })
    
// });