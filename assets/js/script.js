//querySelector de forma sintetizada
const qs = (element)=>document.querySelector(element);
const qsAll = (element)=>document.querySelectorAll(element);

//variável contadora de pizzas
let modalQt = 1;

//array do carrinho, começa vazio...
let cart = [];

//variável que contém as informações das pizzas(data-key)
let modalKey = 0;

//Listagem das pizzas
pizzaJson.map((item, index) => {
    let pizzaItem = qs('.models .pizza-item').cloneNode(true);

    pizzaItem.setAttribute('data-key', index);

    pizzaItem.querySelector('.pizza-item--img img').src = item.img;

    pizzaItem.querySelector('.pizza-item--price').innerHTML = `R$ ${item.price.toFixed(2)}`;

    pizzaItem.querySelector('.pizza-item--name').innerHTML = item.name;

    pizzaItem.querySelector('.pizza-item--desc').innerHTML = item.description;

    //Evento de clique para abrir o modal
    pizzaItem.querySelector('a').addEventListener('click', (event)=>{
        event.preventDefault();

        let key = event.target.closest('.pizza-item').getAttribute('data-key');

        modalKey = key;

        modalQt = 1;

        qs('.pizzaBig img').src = pizzaJson[key].img;

        qs('.pizzaInfo h1').innerHTML = pizzaJson[key].name;

        qs('.pizzaInfo--desc').innerHTML = pizzaJson[key].description;

        qs('.pizzaInfo--size.selected').classList.remove('selected');

        qsAll('.pizzaInfo--size').forEach((size, sizeIndex) => {
            if ( sizeIndex == 2 ) {
                size.classList.add('selected');
            }
            size.querySelector('span').innerHTML = pizzaJson[key].sizes[sizeIndex];
        });

        qs('.pizzaInfo--qnt').innerHTML = modalQt;

        qs('.pizzaInfo--actualPrice').innerHTML = `R$ ${pizzaJson[key].price.toFixed(2)}`;
        
        qs('.pizzaWindowArea').style.opacity = 0;

        qs('.pizzaWindowArea').style.display = 'flex';

        setTimeout(()=>{
            qs('.pizzaWindowArea').style.opacity = 1;
        }, 200);
    });

    qs('.pizza-area').append(pizzaItem);
});

//Eventos do Modal...
//Function para fechar o modal
function closeModal() {
    qs('.pizzaWindowArea').style.opacity = 0;

    setTimeout(()=>{
        qs('.pizzaWindowArea').style.display = 'none';
    }, 500);
}
qsAll('.pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton').forEach((item)=> {
    item.addEventListener('click', closeModal);
});

//Button - +
qs('.pizzaInfo--qntmenos').addEventListener('click', ()=>{
    if ( modalQt > 1 ) {
        modalQt --;
        qs('.pizzaInfo--qnt').innerHTML = modalQt;
    }
});
qs('.pizzaInfo--qntmais').addEventListener('click', ()=>{
    modalQt ++;
    qs('.pizzaInfo--qnt').innerHTML = modalQt;
});

//Button, selected sizes pizzas
qsAll('.pizzaInfo--size').forEach((size, sizeIndex)=>{
    size.addEventListener('click', (e)=>{
        qs('.pizzaInfo--size.selected').classList.remove('selected');
        size.classList.add('selected');
    });
});

//button add to cart
//para saber o data-key(pizzas) clicado...
qs('.pizzaInfo--addButton').addEventListener('click', ()=>{
    //Pegar o tamanho da pizza
    let size = parseInt(qs('.pizzaInfo--size.selected').getAttribute('data-key'));

    //identificador de pizzas
    let identifier = "Pizza: "+pizzaJson[modalKey].id +" Tamanho: "+size;

    //verificador de pizzas
    let key = cart.findIndex((item)=>{
        return item.identifier == identifier;
    });
    if ( key > -1 ) {
        cart[key].qt += modalQt;
    } else {
        //add ao carrinho
        cart.push({
            identifier,
            id: pizzaJson[modalKey].id,
            size,
            qt: modalQt
        });
    }
    //Atualizar o carrinho
    updateCart();
    //Apos add ao carrinho, fechar o modal
    closeModal();
});

//Exibi o carrinho quando alguma coisa é add
//condição para o meu aside aparecer na tela (function)
function updateCart() {
    if ( cart.length > 0 ) {
        qs('aside').classList.add('show');

        qs('.cart').innerHTML = '';

        let subtotal = 0;

        let desconto = 0;

        let total = 0;

        for( let i in cart ) {
            let pizzaItem = pizzaJson.find((item)=>item.id == cart[i].id);

            //Calculando o subtotal das pizzas adicionadas dentro do carrinho
            subtotal += pizzaItem.price * cart[i].qt;
            
            //Clonar o carrinho e preencher as informações
            let cartItem = qs('.models .cart--item').cloneNode(true);

            //Preenchendo a imagem no carrinho
            cartItem.querySelector('img').src = pizzaItem.img;

            let pizzaSizeName;
            switch(cart[i].size) {
                case 0:
                    pizzaSizeName = 'Pequena';
                    break;
                case 1:
                    pizzaSizeName = 'Média';
                    break;
                case 2:
                    pizzaSizeName = 'Grande';
                    break;
            }

            //Uma concatenação usando template string entre o nome da pizza + o seu tamanho *
            let pizzaName = `${pizzaItem.name} (${pizzaSizeName})`;

            //Preenchendo o nome da pizza *
            cartItem.querySelector('.cart--item-name').innerHTML = pizzaName;

            //Preenchendo a quantidade ao carrinho
            cartItem.querySelector('.cart--item--qnt').innerHTML = cart[i].qt;

            //Action button + & -
            cartItem.querySelector('.cart--item-qntmenos').addEventListener('click', ()=>{
                if ( cart[i].qt > 1 ) {
                    cart[i].qt --;
                } else {
                    cart.splice(i, 1);
                }
                updateCart();
            });

            cartItem.querySelector('.cart--item-qntmais').addEventListener('click', ()=>{
                cart[i].qt ++;
                updateCart();
            });

            //Add os itens ao carrinho de fato
            qs('.cart').append(cartItem);
        }

        //Aplicando o desconto
        desconto = subtotal * 0.1;

        //Resultado do total
        total = subtotal - desconto;

        //Exibindo os respectivos valores
        qs('.subtotal span:last-child').innerHTML = `R$ ${subtotal.toFixed(2)}`;

        qs('.desconto span:last-child').innerHTML = `R$ ${desconto.toFixed(2)}`;

        qs('.total span:last-child').innerHTML = `R$ ${total.toFixed(2)}`;
    } else {
        qs('aside').classList.remove('show');
    }
}