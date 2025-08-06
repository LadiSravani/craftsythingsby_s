// Simple Crafts Gallery app using localStorage
const form = document.getElementById('craftForm');
const titleInput = document.getElementById('title');
const descInput = document.getElementById('description');
const materialsInput = document.getElementById('materials');
const priceInput = document.getElementById('price');
const imageInput = document.getElementById('image');
const imgPreview = document.getElementById('imgPreview');
const craftList = document.getElementById('craftList');

const STORAGE_KEY = 'crafts_gallery_items';

// load items from localStorage
let items = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');

function saveItems(){
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

function render(){
  craftList.innerHTML = '';
  if(items.length === 0){
    craftList.innerHTML = '<p>No crafts yet. Add some using the form!</p>';
    return;
  }
  items.slice().reverse().forEach((item, idx) => {
    // idx is index in reversed array; compute original index
    const origIndex = items.length - 1 - idx;
    const card = document.createElement('div');
    card.className = 'card';
    if(item.imageData){
      const img = document.createElement('img');
      img.src = item.imageData;
      img.alt = item.title;
      card.appendChild(img);
    }
    const h3 = document.createElement('h3');
    h3.textContent = item.title;
    card.appendChild(h3);

    const pdesc = document.createElement('p');
    pdesc.textContent = item.description;
    card.appendChild(pdesc);

    if(item.materials){
      const mats = document.createElement('p');
      mats.className = 'materials';
      mats.textContent = 'Materials: ' + item.materials;
      card.appendChild(mats);
    }

    if(item.price){
      const price = document.createElement('p');
      price.className = 'price';
      price.textContent = 'Price: ₹' + parseFloat(item.price).toFixed(2);
      card.appendChild(price);
    }

    const actions = document.createElement('div');
    actions.className = 'actions';
    const delBtn = document.createElement('button');
    delBtn.className = 'btn secondary';
    delBtn.textContent = 'Delete';
    delBtn.onclick = () => {
      if(confirm('Delete this craft?')){
        items.splice(origIndex, 1);
        saveItems();
        render();
      }
    };
    actions.appendChild(delBtn);
    card.appendChild(actions);

    craftList.appendChild(card);
  });
}

// preview image when chosen
imageInput.addEventListener('change', () => {
  const file = imageInput.files[0];
  if(!file) {
    imgPreview.style.display = 'none';
    imgPreview.src = '';
    return;
  }
  const reader = new FileReader();
  reader.onload = e => {
    imgPreview.src = e.target.result;
    imgPreview.style.display = 'block';
  };
  reader.readAsDataURL(file);
});

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  // read image data if any
  let imageData = null;
  const file = imageInput.files[0];
  if(file){
    imageData = await readFileAsDataURL(file);
  }

  const newItem = {
    title: titleInput.value.trim(),
    description: descInput.value.trim(),
    materials: materialsInput.value.trim(),
    price: priceInput.value ? parseFloat(priceInput.value).toFixed(2) : '',
    imageData: imageData
  };

  items.push(newItem);
  saveItems();
  form.reset();
  imgPreview.style.display = 'none';
  render();
});

function readFileAsDataURL(file){
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result);
    r.onerror = reject;
    r.readAsDataURL(file);
  });
}

// initial render
render();
