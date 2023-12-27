const API = 'http://localhost:8000/user';

const body = document.querySelector('body');
const addButton = document.querySelector('.top-contact__button');
const addForm = document.querySelector('.add');
const updateForm = document.querySelector('.update');
const closeButton = document.querySelector('#close-image');

addButton.addEventListener("click", function (e) {
	addForm.style = "display: block";
});
closeButton.addEventListener("click", function (e) {
	addForm.style = "display: none";
});





//! CRUD
const inputName = document.querySelector('#name');
const inputSurname = document.querySelector('#surname');
const inputPhone = document.querySelector('#phoneNumber');
const inputPhoto = document.querySelector('#photo');
const errorItemName = document.querySelector('#errorName');
const errorItemSurname = document.querySelector('#errorSurname');
const errorItemNumber = document.querySelector('#errorNum');
const contactList = document.querySelector('.bottom-contact__list');

const updateName = document.querySelector('#updateName');
const updateSurname = document.querySelector('#updateSurname');
const updatePhone = document.querySelector('#updatePhoneNumber');
const updatePhoto = document.querySelector('#updatePhoto');

document.addEventListener("click", inputSearch);
function inputSearch(e) {
	const targetElement = e.target;
	if (inputName) {
		if (targetElement.closest("#name")) {
			targetElement.addEventListener("input", function (e) {
				if (!e.target.value.trim()) {
					errorItemName.innerHTML = "Напишите имя!"
				} else {
					errorItemName.innerHTML = "";
				}
			});
		}
	}
	if (inputSurname) {
		if (targetElement.closest("#surname")) {
			targetElement.addEventListener("input", function (e) {
				if (!e.target.value.trim()) {
					errorItemSurname.innerHTML = "Напишите фамилию!"
				} else {
					errorItemSurname.innerHTML = "";
				}
			});
		}
	}
	if (inputPhone) {
		if (targetElement.closest("#phoneNumber")) {
			targetElement.addEventListener("input", function (e) {
				if (!e.target.value.trim()) {
					errorItemNumber.innerHTML = "Напишите номер телефона!"
				} else {
					errorItemNumber.innerHTML = "";
				}
			});
		}
	}
}

addForm.addEventListener("submit", function (e) {
	e.preventDefault();
	if (!e.target.name.value.trim() || !e.target[2].value.trim()) {
		alert("Поля *Имя и *Номер телефона - обязательны");
	} else {
		const reader = new FileReader();
		reader.onload = function (event) {
			let newObj = {
				inputName: inputName.value,
				inputSurname: inputSurname.value,
				inputPhone: inputPhone.value,
				inputPhoto: event.target.result,
			};
			postElements(newObj);
			inputName.value = '';
			inputSurname.value = '';
			inputPhone.value = '';
			inputPhoto.value = '';
		};
		reader.readAsDataURL(inputPhoto.files[0]);
		addForm.style = "display: none";
	};
});

function postElements(obj) {
	fetch(API, {
		method: "POST",
		headers: {
			"Content-Type": "application/json; charset=utf-8",
		},
		body: JSON.stringify(obj),
	}).then(() => showUpdateContacts());
};

function showUpdateContacts() {
	fetch(API)
		.then((res) => {
			return res.json();
		})
		.then((data) => {
			contactList.innerText = "";
			data.forEach((elem) => {
				contactList.innerHTML += `
			<li class="bottom-contact__item" data-id="${elem.id}">
			<div class="bottom-contact__image-ibg">
			<img src="${elem.inputPhoto}">
						</div>
						<div class="bottom-contact__info">
							<div class="bottom-contact__body">
							<div class="bottom-contact__names">
									<div class="bottom-contact__name">${elem.inputName} &nbsp;</div>
									<div class="bottom-contact__name">${elem.inputSurname}</div>
								</div>
								<a href="tel:${elem.inputPhone}" class="bottom-contact__phone">${elem.inputPhone}</a>
							</div>
							<button type="button" class="bottom-contact__delet">
							<img src="./img/cart.svg">
							</button>
							<button type="button" class="bottom-contact__redact">
								<img src="./img/redact.svg">
								</button>
								</div>
								</li>
								`;
			});
			const items = document.querySelectorAll('.bottom-contact__item');
			items.forEach(item => {
				const deleteButton = item.querySelector('.bottom-contact__delet');
				deleteButton.addEventListener("click", function (e) {
					const listItem = e.target.closest('.bottom-contact__item');
					const idToDelete = listItem.dataset.id;
					fetch(`${API}/${idToDelete}`, {
						method: 'DELETE',
					})
						.then(response => response.json())
						.then(() => {
							showUpdateContacts();
						})
				});
				const redactButton = item.querySelector('.bottom-contact__redact');
				redactButton.addEventListener("click", function (e) {
					updateForm.style = "display: block";
					const listRedactItem = e.target.closest('.bottom-contact__item');
					const idToRedact = listRedactItem.dataset.id;
					updateForm.addEventListener("submit", function (e) {
						const reader = new FileReader();
						reader.onload = function (event) {
							let updateObject = {
								inputName: updateName.value,
								inputSurname: updateSurname.value,
								inputPhone: updatePhone.value,
								inputPhoto: event.target.result,
							};
							updateContact(updateObject, idToRedact);
						};
						reader.readAsDataURL(updatePhoto.files[0]);
						e.preventDefault();
					});
				});
			});
		});
};
showUpdateContacts();

function updateContact(formData, idUpdateObj) {
	fetch(`${API}/${idUpdateObj}`, {
		method: "PUT",
		headers: {
			"Content-Type": "application/json; charset=utf-8",
		},
		body: JSON.stringify(formData),
	}).then(() => {
		showUpdateContacts()
		const closeUpdate = document.querySelector('#close-update');
		closeUpdate.addEventListener("click", function (e) {
			updateForm.style = "display: none";
		});
		updateName.value = '';
		updateSurname.value = '';
		updatePhone.value = '';
		updatePhoto.value = '';
	})
}