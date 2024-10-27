export class FeedbackDisplay {
	constructor() {
		this.body = document.querySelector('body')

		try {
			this.init()
		} catch (error) {
			console.error(error)
			this.body.innerHTML = '<p>Error loading feedback</p>'
		}
	}

	async init() {
		const feedback = await this.fetch()
		this.render(feedback)
	}

	async fetch() {
		const data = await fetch('https://bb-feedback-function.deno.dev/')
		const json = await data.json()
		return this.applyFilters(json)
	}

	render(feedback) {
		// Generate content
		const feedbackElement = document.createElement('main')
		feedbackElement.classList.add('dark')
		const feedbackHeader = document.createElement('h1')
		feedbackHeader.textContent = 'Feedback'
		const feedbackList = this.getFeedbackList(feedback)

		// Append content to the element
		feedbackElement.appendChild(feedbackHeader)
		feedbackElement.appendChild(feedbackList)

		// Append the element to the body
		this.body.appendChild(feedbackElement)
	}

	getFeedbackList(feedback) {
		if (!feedback.length) {
			const feedbackElement = document.createElement('p')
			feedbackElement.textContent = 'No feedback available'
			return feedbackElement
		}

		const feedbackList = document.createElement('ul')
		feedbackList.classList.add('feedback-list')

		feedback.reverse().forEach((item) => {
			const feedbackItem = document.createElement('li')
			const feedbackArticle = document.createElement('article')
			feedbackItem.appendChild(feedbackArticle)

			const feedbackContent = document.createElement('p')
			feedbackContent.textContent = item.message
			const feedbackBlock = document.createElement('blockquote')
			feedbackBlock.appendChild(feedbackContent)

			const feedbackAuthor = document.createElement('span')
			feedbackAuthor.textContent = item.email
			const feedbackDate = document.createElement('span')
			feedbackDate.textContent = new Date(item.dateSubmitted).toLocaleString()
			const feedbackCitation = document.createElement('cite')
			feedbackCitation.appendChild(feedbackAuthor)
			feedbackCitation.innerHTML += ' - '
			feedbackCitation.appendChild(feedbackDate)

			feedbackArticle.appendChild(feedbackBlock)
			feedbackArticle.appendChild(feedbackCitation)

			feedbackList.appendChild(feedbackItem)
		})

		return feedbackList
	}

	applyFilters(feedback) {
		return feedback.filter((item) => item.dateSubmitted < new Date('2024-10-01'))
	}
}
