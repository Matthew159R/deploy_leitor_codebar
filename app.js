const popupWrapper = document.querySelector('.popup-wrapper')
const popupInsertOrRemoveQtdEquipament = document.querySelector('.popup')
const startScannerButton = document.querySelector('.scanner')
const popupStartScanner = document.querySelector('.popup-start-scanner')
const popupAddNewEquipament = document.querySelector('.popup-add-item')
const closePopupButton = document.querySelector('.close')
const formCreateNewEquipament = popupAddNewEquipament.querySelector('form')

let scannerCodebarStart = false
let equipament

startScannerButton.addEventListener('click', event => {
    elementVisibleOrInvisivble(popupStartScanner, 'flex')
    scannerCodebarStart = true
})

popupStartScanner.addEventListener('click', event => {
    if (event.target.classList.contains('popup-start-scanner')) {
        elementVisibleOrInvisivble(popupStartScanner, 'none')
        scannerCodebarStart = false
        codebar = ''
    }
})

let codebar = ''
let key = ''
document.addEventListener('keydown', event => {
    if (scannerCodebarStart) {
        const regexTestsNumber = /^\d+$/
        regexTestsNumber.test(event.key) === true ? codebar += event.key : false
        console.log(codebar)
        if (codebar.length === 9) {
            key = codebar
            const item = getEquipamentLocalStorage(key)

            if (item) {
                equipament = item
                console.log(equipament)
                popupInsertOrRemoveQtdEquipament.querySelector('[data-js="nome_equipamento"]').textContent = equipament.nome_equipamento
                popupInsertOrRemoveQtdEquipament.querySelector('[data-js="quantidade_caixas"]').textContent = equipament.quantidade_caixas
                elementVisibleOrInvisivble([popupWrapper, popupInsertOrRemoveQtdEquipament], 'flex')
                elementVisibleOrInvisivble(popupAddNewEquipament, 'none')
            } else {
                elementVisibleOrInvisivble([popupWrapper, popupAddNewEquipament], 'flex')
            }
        }
    }
})

popupWrapper.addEventListener('click', event => {
    const clickedElement = event.target
    if (clickedElement.classList.contains('close')) {
        elementVisibleOrInvisivble([popupWrapper, clickedElement.parentElement, popupStartScanner], 'none')
        console.log(clickedElement.parentElement)
        scannerCodebarStart = false
    } else if (clickedElement.classList.contains('addEquipamentButton')) {
        entryOrExitEquipment(key, 'entry')
        elementVisibleOrInvisivble([popupWrapper, popupInsertOrRemoveQtdEquipament, popupStartScanner], 'none')
        scannerCodebarStart = false
    } else if (clickedElement.classList.contains('removeEquipamentButton')) {
        entryOrExitEquipment(key, 'exit')
        elementVisibleOrInvisivble([popupWrapper, popupInsertOrRemoveQtdEquipament, popupStartScanner], 'none')
        scannerCodebarStart = false
    } else if (clickedElement.classList.contains('insertItem')) {
        elementVisibleOrInvisivble([popupWrapper, popupAddNewEquipament, popupStartScanner], 'none')
        scannerCodebarStart = false
    }
    codebar = ''
})

const entryOrExitEquipment = (itemIdCodebar, removeOrInsert) => {
    const quantity = popupInsertOrRemoveQtdEquipament.querySelector('#quantidade')    
    if (removeOrInsert === 'exit') {
        if (quantity.value) {
            if (equipament.quantidade_caixas - parseInt(quantity.value) < 0) {
                equipament.quantidade_caixas = 0
            } else {
                equipament.quantidade_caixas -= parseInt(quantity.value)
            }
        }
    } else if (removeOrInsert === 'entry') {
        if (quantity.value) {
            equipament.quantidade_caixas += parseInt(quantity.value)
        }
    }
    saveEquipamentLocalStorage(key, equipament)
    quantity.value = ''
    console.log(equipament)
}

formCreateNewEquipament.addEventListener('submit', event => {
    event.preventDefault()
    const newEquipament = {}
    const inputsForm = event.target.querySelectorAll('input')

    newEquipament['codigo_barras'] = key
    inputsForm.forEach(input => {
        const inputTypeNumber = input.type === 'number'

        if (inputTypeNumber) {
            newEquipament[input.id] = parseInt(input.value)
        } else {
            newEquipament[input.id] = input.value
        }
    })
    // Essa lógica irá mudar caso o input de textarea mude para um dropdown ou outra coisa
    const textArea = event.target.aulas_relacionadas.value.split(' ')
    newEquipament['aulas_relacionadas'] = textArea
    console.log(newEquipament)
    saveEquipamentLocalStorage(key, newEquipament)
})

const elementVisibleOrInvisivble = (elements, newDisplayElement) => {
    if (elements instanceof Array) {
        elements.forEach(element => {
            element.style.display = newDisplayElement
        })
    } else {
        elements.style.display = newDisplayElement
    }
}

const saveEquipamentLocalStorage = (codebar, equipament) => {
    localStorage.setItem(codebar, JSON.stringify(equipament))
}

const getEquipamentLocalStorage = (codebar) => {
    const item = localStorage.getItem(codebar)
    return item ? JSON.parse(item) : null
}

setInterval(() => {
    codebar = ''
}, 1000)