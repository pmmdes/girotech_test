const Form = {
    capital: document.getElementById('capital_investment'),
    time: document.getElementById('time_investment'),
    tax: document.getElementById('taxes'),

    getValues() {
        return {
            capital: Form.capital.value,
            time: Form.time.value,
            tax: Form.tax.value,
        }
    },

    validateFields() {
        const { capital, time, tax } = Form.getValues()
        if(capital.trim() === "" || time.trim() === "" || tax.trim() === "") {
            throw new Error("Por favor, preencha todos os campos.")
        }        
    },

    submit(event) {

        event.preventDefault()       
        
        try {

            //validate inputs
            Form.validateFields();

            //get final return of investment
            let returns = Calculate.totalInvestment(Form.getValues());

            //print results
            DOM.updateResultLabel(returns);
            DOM.updateTaxReturnLabel(Form.capital.value, returns);

            //build up table
            DOM.clearHistoryTable();
            DOM.createHistoryTable();

        } catch (error) {
            alert(error.message);
        }

    }
}

const Calculate = {    

    history: [],

    getCapitalHistory() {
        return this.history;
    },

    getTaxTotal(){
        return this.taxTotal;
    },

    totalInvestment(object) {

        let {capital, time, tax} = object;

        this.history = [];

        //transforming text in number to do math operations
        capital = Number(capital);

        //taking the percentage of tax
        tax = tax/100;

        //calculating the investment
        for(let i=0; i<time;i++){

            capital += capital*tax;

            //rounding results
            capital = +(capital.toFixed(2));

            //storing the capital values by month            
            this.history.push(capital);
        }
        
        return capital;
    },
}

const DOM = {

    investmentReturnLabel: document.getElementById("investment_return_label"),
    taxReturnLabel: document.getElementById("tax_return_label"),
    tbody: document.querySelector("#history_table tbody"),
    section: document.getElementById("results_section"),
    table: document.getElementById("history_table"),

    updateResultLabel(returns) {        
        this.investmentReturnLabel.innerText = `${Utils.formatCurrency(returns)}`;
    },

    updateTaxReturnLabel(investment, returns) {
        this.taxReturnLabel.innerText = `${Utils.formatCurrency(returns-investment)}`;        
    },

    createHistoryTable() { 

        const {time} = Form.getValues();

        const values = Calculate.getCapitalHistory();

        for(let i=0;i<time;i++) {

            const html = `
                <td>${i+1}</td>
                <td>${Utils.formatCurrency(values[i])}</td>
            `
            const tr = document.createElement("tr");
            tr.innerHTML = html;
            tr.dataset.index = time;

            this.tbody.appendChild(tr)
        }
        
    },

    clearHistoryTable() {
        this.tbody.innerHTML = ""
    },

    activeElements() { 
        this.section.classList.remove("hidden");
        this.table.classList.remove("hidden");

    },

}

const Utils = {

    formatCurrency(value) {
        value = value.toLocaleString("pt-BR", {
            style: "currency",
            currency: 'BRL'
        });

        return value;
    },

}