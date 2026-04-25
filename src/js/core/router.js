async function navigate(page) {
  const res = await fetch(`/src/html/${page}.html`)
  const html = await res.text()
  document.getElementById('main-content').innerHTML = html

  // Har bir sahifa uchun script
  if (page === 'road-signs') {
    loadRoadSigns()
  }
}

function loadRoadSigns() {
  fetch('/public/data/road-signs.json')
    .then(res => res.json())
    .then(belgilar => {
      const wrapper = document.querySelector('.ogohlantiruvchi')
      
      const kategoriyalar = [
        { key: 'ogohlantiruvchi', nom: 'Ogohlantiruvchi belgilar' },
        { key: 'imtiyozli', nom: 'Imtiyozli belgilar' },
        { key: 'taqiqlovchi', nom: 'Taqiqlovchi belgilar' },
        { key: 'buyuruvchi', nom: 'Buyuruvchi belgilar' },
      ]

      kategoriyalar.forEach(kat => {
        const filtered = belgilar.filter(b => b.kategoriya === kat.key)
        const kardsHtml = filtered.map(b => `
          <div class="belgilar">
            <img src="${b.rasm}" alt="${b.id}">
            <p>${b.nom}</p>
          </div>
        `).join('')

        wrapper.innerHTML += `
          <h2>${kat.nom}</h2>
          <div class="belgilar-grid">${kardsHtml}</div>
        `
      })
    })
}

document.querySelectorAll('[data-page]').forEach(link => {
  link.addEventListener('click', function(e) {
    e.preventDefault()
    navigate(this.dataset.page)
  })
})