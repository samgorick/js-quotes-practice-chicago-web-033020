const quoteList = document.querySelector("#quote-list")
const form = document.querySelector("#new-quote-form")

form.addEventListener("submit", createNewQuote)
quoteList.addEventListener("click", dealWithClick)

function dealWithClick(event){
  if (event.target.className === "btn-success"){
    const quoteId = parseInt(event.target.parentElement.parentNode.id)
    const incrementLikes = parseInt(event.target.innerText.split(" ").pop()) + 1
    event.target.innerText = `Likes: ${incrementLikes}`
    
    fetch('http://localhost:3000/likes', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({quoteId: quoteId})
    })
  } else if (event.target.className === "btn-danger"){
    const quote = event.target.parentElement.parentNode
    const quoteId = parseInt(quote.id)
    quote.remove()

    fetch(`http://localhost:3000/quotes/${quoteId}`, {method: 'DELETE'})
  }
}

function createNewQuote(event){
  event.preventDefault()
  const reqObj = {
    method: 'POST',
    headers: {
      "content-type": "application/json"
    },
    body: JSON.stringify({quote: event.target[0].value, author: event.target[1].value})
  }
  form.reset()

  fetch(`http://localhost:3000/quotes`, reqObj)
  .then(resp => resp.json())
  .then(json => quoteList.innerHTML += renderOneQuote(json))
}

function getQuotes(){
  fetch(`http://localhost:3000/quotes?_embed=likes`)
  .then (resp => resp.json())
  .then (json => renderQuotes(json))
}

function renderQuotes(quotesList){
  const list = quotesList.map(quote => renderOneQuote(quote)).join('')
  quoteList.innerHTML = list
}

function renderOneQuote(quote){
  let boom = 
  `<li class='quote-card' id='${quote.id}'><blockquote class="blockquote"><p class="mb-0">${quote.quote}</p>
  <footer class="blockquote-footer">${quote.author}</footer><br>
  <button class='btn-success'>Likes: <span>${quote.likes ? quote.likes.length : 0}</span></button>
  <button class='btn-danger'>Delete</button></blockquote></li>`
  return boom
}

getQuotes()