//querySelector de forma sintetizada
const qs = (element)=>document.querySelector(element);
const qsAll = (element)=>document.querySelectorAll(element);

pizzaJson.map((item, index) => {
    let pizzaItem = qs('.models .pizza-item').cloneNode(true);

    pizzaItem.setAttribute('data-key', index);

    pizzaItem.querySelector('.pizza-item--img img').src = item.img;

    pizzaItem.querySelector('.pizza-item--price').innerHTML = `R$ ${item.price.toFixed(2)}`;

    pizzaItem.querySelector('.pizza-item--name').innerHTML = item.name;

    pizzaItem.querySelector('.pizza-item--desc').innerHTML = item.description;

    pizzaItem.querySelector('a').addEventListener('click', (event)=>{
        event.preventDefault();

        let key = event.target.closest('.pizza-item').getAttribute('data-key');

        qs('.pizzaBig img').src = pizzaJson[key].img;

        qs('.pizzaInfo h1').innerHTML = pizzaJson[key].name;

        qs('.pizzaInfo--desc').innerHTML = pizzaJson[key].description;
        
        qs('.pizzaWindowArea').style.opacity = 0;

        qs('.pizzaWindowArea').style.display = 'flex';

        setTimeout(()=>{
            qs('.pizzaWindowArea').style.opacity = 1;
        }, 200);
    });

    qs('.pizza-area').append(pizzaItem);
});