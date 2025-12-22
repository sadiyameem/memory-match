// variables
const emojis = ["🍎","🍎","🍐","🍐","🍊","🍊","🍋","🍋","🍋‍🟩","🍋‍🟩","🍌","🍌","🍉","🍉","🍇","🍇"];
var shuf_emojis = emojis.sort(() => (Math.random() > .5) ? 2 : -1);
for ( var i =0; i<emojis.length; i++){
    let box = document.createElement('div')
    box.className = 'item';
    box.innerHTML = shuf_emojis[i]

    box.onclick = function(){
        this.classList.add('boxOpen')
    }

    document.querySelector('.game').appendChild(box);
}