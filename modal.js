/********** @start modals **********/

async function showModal(htmlTemplateSrc) {
	try {
		const modalContainer = document.getElementById('modal-container');
		modalContainer.classList.add('backdrop');
		modalContainer.addEventListener('click', handleClose);
		const htmlResponse = await fetch(htmlTemplateSrc);
		modalContainer.innerHTML = await htmlResponse.text();
	} catch (exception) {
		console.error(exception);
	}
}

const handleClose = (event) => {
	const modalContainer = document.getElementById('modal-container');
	const closeModalBtn = document.getElementById('close-modal');
	if (
		event.srcElement === modalContainer ||
		event.srcElement === closeModalBtn
	) {
		closeModal();
	}
}

const closeModal = () => {
	const modalContainer = document.getElementById('modal-container');
	modalContainer.classList.remove('backdrop');
	modalContainer.removeEventListener('click', handleClose);
	modalContainer.innerHTML = '';
}

/********** @end modals **********/
