// Variables
const submitBtn = document.getElementById("submitBtn")
const checkbox = document.getElementById("checkbox")
const customAmtCheckbox = document.getElementById("custom-amount-checkbox")
const customAmtContainer = document.querySelector(".custom-amount-container")
const customAmtInput = document.querySelector(".custom-amount-input")
const firstCase = document.getElementById("firstCase")
const lastCase = document.getElementById("lastCase")
const suNumber = document.getElementById("suNumber")
const qirNumber = document.getElementById("qirNumber")
const container = document.getElementById("container")
const closeModal = document.getElementById("closeModal")
const overlay = document.getElementById("overlay")
const emailSendBtn = document.getElementById("email-send-btn")
const statusListCopy = document.getElementById("status-list-copy-icon")
const mapCopy = document.getElementById("map-copy-icon")
const emailContainer = document.getElementById("email-container")
const emailBody = document.querySelector(".email-body")
const statusListBody = document.querySelector(".status-list-body")
const mapBody = document.querySelector(".map-body")

let isSTU = false
let isCustomInputShowing = false

// Event Listeners
checkbox.addEventListener("change", (e) => {
    e.target.value === "STU" ? (isSTU = true) : (isSTU = false)
    isCustomInputShowing = false
    customAmtContainer.style.display = "none"
})

customAmtCheckbox.addEventListener("change", (e) => {
    if (e.target.value === "custom") {
        isCustomInputShowing = true
        customAmtContainer.style.display = "flex"
        isSTU = false
    }
})

lastCase.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
        e.preventDefault()
        submitBtn.click()
    }
})

emailSendBtn.addEventListener("click", () => {
    const text = emailContainer.textContent
    emailSendBtn.setAttribute(
        "href",
        `mailto:peter.xiong@gbo.com;king.vang@gbo.com;paul.chastain@gbo.com&cc=asa.kelly@gbo.com&body=${text}`
    )
    emailSendBtn.innerHTML = `<span class="email-send-btn">Email sent!</span>`
    setTimeout(() => {
        emailSendBtn.innerHTML =
            '<span class="email-send-btn">Send Email</span>'
    }, 2000)
})

statusListCopy.addEventListener("click", () => {
    const text = statusListBody.textContent
    navigator.clipboard
        .writeText(text)
        .then(() => {
            statusListCopy.innerHTML = `<span>Copied!</span>`
            setTimeout(() => {
                statusListCopy.innerHTML = `<img src="./icons/copy.png" alt="copy" />`
            }, 2000)
        })
        .catch((err) => {
            console.log("Error in copying text: ", err)
        })
})

mapCopy.addEventListener("click", () => {
    const text = mapBody.textContent
    navigator.clipboard
        .writeText(text)
        .then(() => {
            mapCopy.innerHTML = `<span>Copied!</span>`
            setTimeout(() => {
                mapCopy.innerHTML = `<img src="./icons/copy.png" alt="copy" />`
            }, 2000)
        })
        .catch((err) => {
            console.log("Error in copying text: ", err)
        })
})

submitBtn.addEventListener("click", addItem)

// Functions
function addItem(e) {
    e.preventDefault()
    let box1 = Number(firstCase.value)
    let box2 = Number(lastCase.value)
    let suNumberValue = suNumber.value
    let qirNumberValue = qirNumber.value
    if (box1 === 0 || box2 === 0) {
        alert("Please enter a valid case number")
    } else if (!/^[0-9]+$/.test(box1)) {
        alert("Enter first case number")
    } else if (!/^[0-9]+$/.test(box2)) {
        alert("Enter last case number")
    } else if (box2 < box1) {
        console.log(typeof box1, typeof box2)
        alert("Incorrect case range. Try again.")
    } else {
        const amount = total(box1, box2)

        const itemContainer = document.createElement("div")
        itemContainer.classList.add("item")
        resultsArea.append(itemContainer)

        const caseRange = document.createElement("p")
        caseRange.textContent = `Case range: ${box1} - ${box2}`
        itemContainer.append(caseRange)

        const amtOfCases = document.createElement("p")
        amtOfCases.textContent = `Amount of cases: ${amount.result}`
        itemContainer.append(amtOfCases)

        const totalPcs = document.createElement("p")
        totalPcs.textContent = `Total pieces: ${amount.resultPcs.toLocaleString()}`
        itemContainer.append(totalPcs)

        const deleteBtn = document.createElement("i")
        deleteBtn.classList.add("fa", "fa-times-circle-o", "delete-btn")
        itemContainer.append(deleteBtn)
        itemContainer.addEventListener("mouseenter", () => {
            deleteBtn.classList.add("delete-btn-show")
        })
        itemContainer.addEventListener("mouseleave", () => {
            deleteBtn.classList.remove("delete-btn-show")
        })
        itemContainer.addEventListener("click", () => {
            overlay.style.display = "block"
            if (box1 === box2) {
                const emailContent = `Case ${box1} (${amount.resultPcs.toLocaleString()} pcs) needs to be transferred in SAP on SU ${suNumberValue}.  This is physically located in Q10 QA2.`
                emailBody.textContent = emailContent
                statusListBody.textContent = `Q10: ${box1}, #${suNumberValue}`
                mapBody.textContent = `${qirNumberValue} (${box1})`
            } else {
                const emailContent = `Cases ${box1} - ${box2} (${amount.resultPcs.toLocaleString()} pcs) need to be transferred in SAP on SU ${suNumberValue}.  These are physically located in Q10 QA2.`
                emailBody.textContent = emailContent
                statusListBody.textContent = `Q10: ${box1} - ${box2}, #${suNumberValue}`
                mapBody.textContent = `${qirNumberValue} (${box1} - ${box2})`
            }
        })

        deleteBtn.addEventListener("click", (e) => {
            itemContainer.remove()
            e.stopPropagation()
        })

        closeModal.addEventListener("click", () => {
            overlay.style.display = "none"
        })

        firstCase.focus()
        firstCase.value = ""
        lastCase.value = ""
        suNumber.value = ""
        qirNumber.value = ""
    }
}

function total(first, last) {
    const result = last - first + 1
    let resultPcs
    if (isSTU) {
        resultPcs = result * 1000
    } else if (isCustomInputShowing) {
        resultPcs = result * Number(customAmtInput.value)
    } else {
        resultPcs = result * 1200
    }
    return {
        result: result,
        resultPcs: resultPcs,
    }
}
