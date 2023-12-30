// options.js

function getSelectedOption() {
    const temperatureOptions = document.getElementsByName('temperature');
    let selectedOption;

    for (let i = 0; i < temperatureOptions.length; i++) {
        if (temperatureOptions[i].checked) {
            selectedOption = temperatureOptions[i].value;
            break;
        }
    }

    document.getElementById('result').textContent = `Selected option: ${selectedOption}`;
}
