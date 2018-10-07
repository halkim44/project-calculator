const buttons = document.querySelectorAll('input');
const problemDisp = document.querySelector('.problem');
const answerDisp = document.querySelector('.answer');

const problem = {
    asString: "",
    asArray: function() {return this.asString.split(" ")},
    operate: function(){return operate(this.asArray())},
    backspace: function() {return backspace(this.asString)},
    isAnswered: false,
    isFloat: false,
    counter: 0,
}

function operate(arr) {
    let ans = parseFloat(arr[0]);

    for(let a=1; a < arr.length; a++) {
        let num2 = parseFloat(arr[a+1]);
        
        if(arr[a] == '+') {
            ans = add(ans,num2);
        
        }else if (arr[a] === '−') {
            ans = subtract(ans,num2);
        
        } else if (arr[a] === '×') {
            ans = multiply(ans,num2);
        
        } else if (arr[a] === '÷') {
            ans = divide(ans,num2);
        }
    } 
    return ans;
}

function add(...num) {
    return num[0] + num[1];
}
function subtract(...num) {
    return num[0] - num[1];
}
function multiply(...num) {
    return num[0] * num[1];
}
function divide(...num) {
    return num[0] / num[1];
}

function backspace (str) {
    if(str[str.length-1] === " ") {
        str = str.slice(0, str.length - 3);
    } else {
        str = str.slice(0, str.length - 1);
    }
    return str;
}

function manageInput(val) {
    
    val = manageKeyInp(val);

    if(/=|enter/i.test(val)) {
        problem.isAnswered = true;

    }else if (/⌫|backspace/i.test(val)) {
            problem.asString = problem.backspace();
            problem.isAnswered = false;

    }else if (/CE|delete/i.test(val)) {
        problem.asString = "";
        answerDisp.textContent = "";
        problem.isFloat = false;
    
    }else {
        if(problem.isAnswered) {
            if (/[0-9]/.test(val)) {
                problem.asString = "";
                problem.isFloat = false;
            }

            if(/[\+\−×÷]/.test(val)) {
            problem.asString = answerDisp.textContent;
            }
        }

        problem.asString += val;
        problem.isAnswered = false;
    }
    
    if(val === ".") {
        floatControl();        
    }

    if(/[\+\−×÷]/.test(val)) {
        
        if(problem.asString.indexOf("  −") > -1) {
            problem.asString = problem.asString.replace("  − ", " -");
        }else if(problem.asString.indexOf(" −") === 0){
            problem.asString = problem.asString.replace(" − ", "-");
        }else if (problem.asString.indexOf("- ") > -1 
                  || problem.asString.indexOf("  ") > -1 
                  || problem.asString.lastIndexOf(". ") > -1) {
            problem.asString = problem.asString.slice(0, problem.asString.length - 3);
        }
        problem.isFloat = false;
    }

    
    if(val === ".") {
        problem.isFloat = true;
    }
    displayToScreen(val);
}
function floatControl (){
    if (problem.isFloat){
        problem.asString = problem.asString.slice(0, problem.asString.lastIndexOf("."));
    }

    if (problem.asString.lastIndexOf(" .") > -1) {
        problem.asString = problem.asString.replace(" .", " 0.");
    } 
    problem.asString = problem.asString.replace("-.", "-0.");
}

function roundNum(num) {
    return Math.round(num * 1000000) / 1000000;
}

function displayToScreen(val) {
    
    btnColorChange(val);

    if (problem.asString.slice(problem.asString.lastIndexOf(" ") + 1).length > 9 || problem.asString.length > 72) {
        problem.asString = problemDisp.textContent;
    } 
    if(/=|enter/i.test(val)) {
        if(/[0-9.]/.test(problem.operate())){
            answerDisp.textContent = roundNum(problem.operate());
        } else {
            answerDisp.textContent = "Syntax Error";
        }

        problemDisp.classList.remove("focus");
        answerDisp.classList.add("focus");

    } else {
        problemDisp.textContent = problem.asString;
        answerDisp.classList.remove("focus");
        problemDisp.classList.add("focus");
    }
    longCalcuCtrl();

}
function btnColorChange(val) {
    buttons.forEach(btn => {
        if(/=/.test(val) && btn.value == val) {
            btn.style.backgroundColor = "rgb(233, 30, 120)";

        } else if(btn.value == val) {
            btn.style.backgroundColor = "#BDBDBD";
        }

        setTimeout(() => {
            btn.style.backgroundColor = "";
        }, 100)
    })
}

function longCalcuCtrl() {
    if (problemDisp.offsetHeight > 100) {
        problemDisp.style.fontSize = "1.5em";
    }

    if (problemDisp.offsetWidth < 120) {
        problemDisp.style.fontSize = "";
    }
    
}

function manageKeyInp(key) {
    switch(key) {
        case "-":
            return " − ";
        case "+":
            return " + ";
        case "/" :
            return " ÷ ";
        case "*":
            return " × ";
    }
    return key;
}
buttons.forEach(btn => btn.addEventListener("click", function() { manageInput(this.value) }));
window.addEventListener("keydown", function(e) {
    if (/[0-9.\+\-\*\/]|enter|backspace|delete/i.test(e.key)){
        manageInput(e.key);
    }
});