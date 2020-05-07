// √fetch request to quotes
// √render quotes
// √add event listeners for like
// √add event listener delete buttons
// √delete quotes from DOM and DB
// √add new quote to DOM and DB
// increment and persist like counter
document.addEventListener('DOMContentLoaded', () => {
    const getQuotes = 'http://localhost:3000/quotes?_embed=likes'
    const quotesUrl = 'http://localhost:3000/quotes'
    const likesUrl = 'http://localhost:3000/likes'
    let quoteList = document.getElementById('quote-list')
    const form = document.getElementById('new-quote-form')
    getLikes()
    function getLikes(id) {
        fetch(likesUrl)
            .then(res => res.json())
            .then(likes => countQuotes(likes, id))
    }
    function countQuotes(likes, id) {
        let likeNum = 0
        likes.forEach(like => {
            if (like.quoteId === id){
            likeNum++
            }
            return likeNum
        })
    }
    function getQuote() {
        fetch(getQuotes)
            .then(response => response.json())
            .then(quotes => quotes.forEach(quote => renderQuotes(quote)));
    }
    function renderQuotes(quote) {
        let quoteLi = document.createElement('li')
        quoteLi.setAttribute('class', 'quote-card')
        quoteLi.dataset.id = quote.id
        quoteLi.dataset.likes = 0 //making it equal to getLikes directly didn't work
        quoteLi.innerHTML =
            `<blockquote class="blockquote">
                <p class="mb-0">${quote.quote}</p>
                <footer class="blockquote-footer">${quote.author}</footer>
                <br>
                    <button class='btn-success'>Likes: <span>${quoteLi.dataset.likes}</span></button>
                    <button class='btn-danger'>Delete</button>
            </blockquote>`
        quoteList.append(quoteLi)
    console.log(quoteLi.dataset.likes)
    }
    quoteList.addEventListener('click', (e) => {
        if (e.target.className === 'btn-danger') {
            let parent = e.target.parentNode.parentNode
            parent.remove()
            fetch(`${quotesUrl}/${parent.dataset.id}`, {
                method: "DELETE"
            })//closes fetch
            // .then(resp => resp.url)
        } // closes if curly
        else if (e.target.className === 'btn-success') {
            let quote = e.target.parentNode.parentNode
            id = parseInt(quote.dataset.id)
            currentLikes = e.target.childNodes[1]
            newLike = parseInt(currentLikes.innerText) + 1
            currentLikes.innerText = `${newLike}`
            quote.dataset.likes = newLike
            fetch(likesUrl, {
                method: "POST",
                headers: {
                    "Content-type": "application/json",
                    "accept": "application/json"
                },
                body: JSON.stringify({
                    "quoteId": id
                }) //closes body
            })//closes fetch
                .then(res => res.json())
        }//closes else if curly
     //closes quoteList
    })
form.addEventListener('submit', (e) => {
    e.preventDefault()
    let newQuote = e.target.querySelector('#new-quote').value
    let newAuthor = e.target.querySelector('#author').value
    let quote = {
        "quote": `${newQuote}`,
        "author": `${newAuthor}`,
    }
    renderQuotes(quote)
    fetch(`${quotesUrl}`, {
        method: "POST",
        headers: {
            "Content-type": "application/json",
            "accept": "application/json"
        },
        body: JSON.stringify(
            quote
        )
    })
})
getQuote()
})
