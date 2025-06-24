$(document).ready(function () {
    const tableBody = $("#table-body");

    // Generate 16 main rows initially
    for (let i = 1; i <= 16; i++) {
        addMainRow(i);
    }

    function addMainRow(index) {
        let row = $("<tr>").attr("data-row", index);
        // First column: Row number
        row.append(`<td class="col-no">${index}</td>`);
        // Second column: Dynamic "Default" column
        row.append(generateDefaultColumn(index));
        // Next, generate the other 16 dynamic columns (data-col = 2 to 17)
        row.append(generateOtherColumns(index));
        tableBody.append(row);
    }

    // Generates the "Default" column (data-col = 1)
    function generateDefaultColumn(rowIndex) {
        return `
            <td>
                <div class="dropdown-container">
                    ${getCustomDropdown()}
                    <button class="btn btn-sm btn-primary add-row" data-row="${rowIndex}" data-col="1">+</button>
                </div>
            </td>
        `;
    }

    // Generates columns for data-col = 2 to 17
    function generateOtherColumns(rowIndex) {
        let columns = "";
        for (let i = 2; i <= 17; i++) {
            columns += `
                <td>
                    <div class="dropdown-container">
                        ${getCustomDropdown()}
                        <button class="btn btn-sm btn-primary add-row" data-row="${rowIndex}" data-col="${i}">+</button>
                    </div>
                </td>
            `;
        }
        return columns;
    }

    function getCustomDropdown() {
        return `
            <div class="dropdown">
                <button class="btn btn-outline-secondary dropdown-toggle dropdown-btn fixed-width" type="button" data-bs-toggle="dropdown">
                    Select Option
                </button>
                <ul class="dropdown-menu">
                    ${generateDropdownOptions()}
                </ul>
            </div>
        `;
    }

    function generateDropdownOptions() {
        const options = [
            "FOP", "BOP", "HI1", "HI2", "EAN+BC", "ING/NUT", "MFG", "FSSAI",
            "SI1", "SI2", "SI3", "SI4", "SI5", "SI6"
        ];
        return options
            .map(opt => `
                <li class="d-flex justify-content-between">
                    <span>
                        <input type="checkbox" class="mandatory-checkbox" data-value="${opt}">
                        <span class="option-text">${opt}</span>
                    </span>
                    <span class="mandatory-text disabled">Mark Mandatory</span>
                </li>
            `)
            .join("");
    }

    // Add row event for dynamically adding a sub row
    $(document).on("click", ".add-row", function () {
        let rowIndex = $(this).data("row");
        let colIndex = $(this).data("col");
        if (!fillExistingEmptyCell(rowIndex, colIndex)) {
            addSubRow(rowIndex, colIndex);
        }
    });

    // Remove row event
    $(document).on("click", ".remove-row", function () {
        let $row = $(this).closest("tr");
        if ($row.attr("data-sub-row") !== undefined) {
            let nonEmptyCount = 0;
            // For sub rows, the first cell (row no) is fixed; skip it.
            $row.find("td").each(function (index) {
                if (index === 0) return;
                if ($.trim($(this).html()) !== "") {
                    nonEmptyCount++;
                }
            });
            if (nonEmptyCount > 1) {
                // Clear only this cell
                $(this).closest("td").html("");
            } else {
                $row.remove();
            }
        } else {
            $row.remove();
        }
        setTimeout(updateAllParentRowIndicators, 100);
    });

    // For sub rows, dynamic cells start at cell index 1 (index 0 is fixed row no)
    function fillExistingEmptyCell(rowIndex, colIndex) {
        let subRows = $(`tr[data-sub-row="${rowIndex}"]`);
        for (let subRow of subRows) {
            // Use nth-child(colIndex+1) because in sub rows, cell index = data-col + fixed cell offset (1)
            let targetCell = $(subRow).find(`td:nth-child(${parseInt(colIndex) + 1})`);
            if (!$.trim(targetCell.html())) {
                targetCell.html(`
                    <div class="dropdown-container">
                        ${getCustomDropdown()}
                        <button class="btn btn-sm btn-primary add-row" data-row="${rowIndex}" data-col="${colIndex}">+</button>
                        <button class="btn btn-sm btn-danger remove-row">x</button>
                    </div>
                `);
                return true;
            }
        }
        return false;
    }

    // Add a new sub row (for dynamic additions)
    function addSubRow(rowIndex, colIndex) {
        let lastSubRow = $(`tr[data-sub-row="${rowIndex}"]`).last();
        let newRow = $("<tr>").attr("data-sub-row", rowIndex);
        // For sub rows, add one fixed cell (for row number)
        newRow.append(`<td class="col-no"></td>`);
        newRow.append(generateEmptyColumns(colIndex, rowIndex));
        if (lastSubRow.length) {
            lastSubRow.after(newRow);
        } else {
            $(`tr[data-row="${rowIndex}"]`).after(newRow);
        }
        setTimeout(updateAllParentRowIndicators, 100);
    }

    // Generate 17 dynamic cells for a sub row; fill only the active column (activeCol)
    function generateEmptyColumns(activeCol, rowIndex) {
        let columns = "";
        for (let i = 1; i <= 17; i++) {
            if (i === activeCol) {
                columns += `<td>
                    <div class="dropdown-container">
                        ${getCustomDropdown()}
                        <button class="btn btn-sm btn-primary add-row" data-row="${rowIndex}" data-col="${i}">+</button>
                        <button class="btn btn-sm btn-danger remove-row">x</button>
                    </div>
                </td>`;
            } else {
                columns += `<td></td>`;
            }
        }
        return columns;
    }

    // Handle checkbox selection (existing functionality)
    $(document).on("change", ".mandatory-checkbox", function () {
        let selectBox = $(this).closest(".dropdown");
        let selectTextArea = selectBox.find(".dropdown-btn");
        let checkBoxes = selectBox.find(".mandatory-checkbox");
        let optionTextElement = $(this).closest("li").find(".option-text");
        let markText = $(this).closest("li").find(".mandatory-text");
        let parentDiv = $(this).closest(".dropdown-container");
        let currentCheckbox = $(this).closest("li").find(".mandatory-checkbox");
        let optionText = optionTextElement.text().trim();

        if ($(this).is(":checked")) {
            selectTextArea.text(optionText);
            markText.removeClass("disabled");
            checkBoxes.prop("disabled", true);
            currentCheckbox.prop("disabled", false);
        } else {
            selectTextArea.text("Select Option");
            if (optionTextElement.length) {
                optionTextElement.text(optionText.replace(" *", ""));
            }
            markText.addClass("disabled").text("Mark Mandatory");
            checkBoxes.prop("disabled", false);
            currentCheckbox.prop("disabled", false);
            parentDiv.find(".add-row").show();
        }
        setTimeout(updateAllParentRowIndicators, 100);
    });

    // Handle "Mark Mandatory" click event
    $(document).on("click", ".mandatory-text", function (e) {
        if ($(this).hasClass("disabled")) return;
        e.stopPropagation();
        let parentDiv = $(this).closest(".dropdown-container");
        let selectBox = $(this).closest(".dropdown");
        let selectTextArea = selectBox.find(".dropdown-btn");
        let checkBoxes = $(".mandatory-checkbox");
        let currentCheckBox = $(this).closest("li").find(".mandatory-checkbox");
        let optionTextElement = $(this).closest("li").find(".option-text");
        let optionText = optionTextElement.text().trim();
        let currentText = $(this).text().trim();

        if (currentText === "Mark Mandatory") {
            $(this).text("Mandatory").addClass("active");
            selectTextArea.text(optionText + " *");
            optionTextElement.text(optionText + " *");
            checkBoxes.prop("disabled", true);
            currentCheckBox.prop("disabled", false);
            parentDiv.find(".add-row").hide();
        } else {
            $(this).text("Mark Mandatory").removeClass("active");
            selectTextArea.text(selectTextArea.text().replace(" *", ""));
            optionTextElement.text(optionTextElement.text().replace(" *", ""));
            checkBoxes.prop("disabled", false);
            parentDiv.find(".add-row").show();
        }
        setTimeout(updateAllParentRowIndicators, 100);
    });

    // --- Disable already selected options from other dropdowns in the same column ---
    // For main rows, dynamic cells start at index 1 (cell 0 is row number)
    function updateDisabledOptionsForColumn(colIndex) {
        const options = ["FOP", "BOP", "HI1", "HI2", "EAN+BC", "ING/NUT", "MFG", "FSSAI", "SI1", "SI2", "SI3", "SI4", "SI5", "SI6"];
        options.forEach(function (opt) {
            let isSelected = false;
            $("#table-body tr").each(function () {
                let cell = $(this).find("td").eq(colIndex);
                let checkbox = cell.find(`input.mandatory-checkbox[data-value="${opt}"]`);
                if (checkbox.length && checkbox.is(":checked")) {
                    isSelected = true;
                    return false;
                }
            });
            $("#table-body tr").each(function () {
                let cell = $(this).find("td").eq(colIndex);
                let checkbox = cell.find(`input.mandatory-checkbox[data-value="${opt}"]`);
                if (checkbox.length) {
                    if (isSelected && !checkbox.is(":checked")) {
                        checkbox.prop("disabled", true);
                    } else {
                        checkbox.prop("disabled", false);
                    }
                }
            });
        });
    }

    function updateAllDisabledOptions() {
        // Dynamic columns now exist from colIndex 1 to 17
        for (let col = 1; col <= 17; col++) {
            updateDisabledOptionsForColumn(col);
        }
    }

    $(document).on("change", ".mandatory-checkbox", function () {
        updateAllDisabledOptions();
    });
    $(document).on("click", ".add-row", function () {
        setTimeout(updateAllDisabledOptions, 100);
    });

    // --- Update parent row indicator ---
    // For main rows, dynamic cell is at index = colIndex (since cell 0 is row number)
    function updateParentRowOrIndicator(rowIndex, colIndex) {
        let parentCell = $(`tr[data-row="${rowIndex}"] td`).eq(colIndex);
        let container = parentCell.find(".dropdown-container");
        let subRows = $(`tr[data-sub-row="${rowIndex}"]`);
        let allNonMandatory = true;
        let hasSelection = false;
        subRows.each(function () {
            let cell = $(this).find("td").eq(colIndex);
            if ($.trim(cell.html()) !== "") {
                let text = cell.find(".dropdown-btn").text().trim();
                if (text !== "" && text !== "Select Option") {
                    hasSelection = true;
                    if (text.indexOf("*") !== -1) {
                        allNonMandatory = false;
                        return false;
                    }
                }
            }
        });
        if (hasSelection) {
            if (allNonMandatory) {
                container.find(".add-row").hide();
                if (container.find(".or-text").length === 0) {
                    container.append('<span class="or-text" style="cursor:pointer;">or</span>');
                }
            } else {
                container.find(".add-row").hide();
                container.find(".or-text").remove();
                $(`tr[data-sub-row="${rowIndex}"]`).each(function () {
                    $(this).find("td").eq(colIndex).find(".add-row").hide();
                });
            }
        } else {
            container.find(".or-text").remove();
            container.find(".add-row").show();
        }
    }

    function updateAllParentRowIndicators() {
        $("tr[data-row]").each(function () {
            let rowIndex = $(this).data("row");
            for (let col = 1; col <= 17; col++) {
                updateParentRowOrIndicator(rowIndex, col);
            }
        });
    }

    $(document).on("change", ".mandatory-checkbox", function () {
        updateAllParentRowIndicators();
    });
    $(document).on("click", ".add-row", function () {
        setTimeout(updateAllParentRowIndicators, 100);
    });
    $(document).on("click", ".remove-row", function () {
        setTimeout(updateAllParentRowIndicators, 100);
    });

    // --- Clicking on 'OR' removes '+' from all sub rows in that column for that parent row ---
    $(document).on("click", ".or-text", function (e) {
        e.stopPropagation();
        let container = $(this).closest(".dropdown-container");
        let colIndex = container.find(".add-row").data("col");
        let parentRow = $(this).closest("tr[data-row]");
        if (!parentRow.length) return;
        let rowIndex = parentRow.data("row");
        $(`tr[data-sub-row="${rowIndex}"]`).each(function () {
            $(this).find("td").eq(colIndex).find(".add-row").hide();
        });
    });
});