// For Pagination

let pageNoBox = document.getElementById("pageNo");
let pageNo = Number(document.getElementById("pageNo").innerText);
let recordsPerTab = 10,
    offset,
    totalPages;

// Navigations

function leftMost() {
    if (pageNo == 1) {
        return;
    } else {
        pageNo = 1;
        pageNoBox.innerText = pageNo;
        medication_table.innerHTML = "";
        headerRow.innerHTML = "";
        insertHeadings(finalData[0]);
        insertData(finalData);
        return;
    }
}

function left() {
    if (pageNo == 1) return;
    pageNo--;
    pageNoBox.innerText = pageNo;
    medication_table.innerHTML = "";
    headerRow.innerHTML = "";
    insertHeadings(finalData[0]);
    insertData(finalData);
    return;
}

function right() {
    if (pageNo == totalPages) {
        pageNo = 1;
        pageNoBox.innerText = pageNo;
        medication_table.innerHTML = "";
        headerRow.innerHTML = "";
        insertHeadings(finalData[0]);
        insertData(finalData);
        return;
    } else {
        pageNo++;
        pageNoBox.innerText = pageNo;
        medication_table.innerHTML = "";
        headerRow.innerHTML = "";
        insertHeadings(finalData[0]);
        insertData(finalData);
        return;
    }
}

function rightMost() {
    if (pageNo == totalPages) {
        return;
    } else {
        pageNo = totalPages;
        pageNoBox.innerText = pageNo;
        medication_table.innerHTML = "";
        headerRow.innerHTML = "";
        insertHeadings(finalData[0]);
        insertData(finalData);
        return;
    }
}