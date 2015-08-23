/// <reference path="../../typings/browser.d.ts" />

// Display error message on a given field
function ShowFieldError(fieldID: string, errorText: string) {
    $('#' + fieldID + '-group')
        .removeClass('has-success')
        .addClass('has-error');
    $('#' + fieldID + '-state-icon')
        .removeClass("fa-check fa-cog fa-spin")
        .addClass("fa-exclamation-triangle")
        .fadeIn("slow");
    $('#' + fieldID + '-state-text')
        .empty()
        .append(errorText)
        .addClass("field-info-message text-danger", "slow");
}

// Display okay message on a given field
function ShowFieldOK(fieldID: string) {
    $('#' + fieldID + '-state-text')
        .removeClass("field-info-message text-danger", "slow");

    $('#' + fieldID + '-group')
        .removeClass('has-error')
        .addClass('has-success');
    $('#' + fieldID + '-state-icon')
        .removeClass("fa-cog fa-spin fa-exclamation-triangle")
        .addClass("fa-check")
        .fadeIn("slow");
}

// Display loading icon on a given field
function ShowLoadingIcon(fieldID: string) {
    // Remove any warning or ok messages
    $('#' + fieldID + '-group')
        .removeClass('has-error has-success');
    $('#' + fieldID + '-state-text')
        .removeClass("field-info-message text-danger", "slow");

    // Set Loading Icon
    $('#' + fieldID + '-state-icon')
        .removeClass("fa-check fa-exclamation-triangle")
        .addClass("fa-cog fa-spin field-icon-loading")
        .fadeIn("fast");
}