'use strict';

// ワークエリア
var wkFirst = "1" //初回FLG
var wkTotal = 0;  //合計
var wkInput = ""; //現在クリックされたボタンの値
var wkCalc = "+"; //初期値 "+"
var wkBefore = "1"; //１つ前の入力 … 0:数値  1:演算子

// ページ上の要素（Element)を参照
const elementCalcLog = document.getElementById("calcLog");     // Vùng hiển thị log
const elementResult  = document.getElementById("result");      // Vùng hiển thị kết quả

// Nút số
const elementNum1 = document.getElementById("num1");
const elementNum2 = document.getElementById("num2");
const elementNum3 = document.getElementById("num3");
const elementNum4 = document.getElementById("num4");
const elementNum5 = document.getElementById("num5");
const elementNum6 = document.getElementById("num6");
const elementNum7 = document.getElementById("num7");
const elementNum8 = document.getElementById("num8");
const elementNum9 = document.getElementById("num9");
const elementNum0 = document.getElementById("num0");

// Nút phép toán
const elementAdd    = document.getElementById("add");
const elementSub    = document.getElementById("sub");
const elementMult   = document.getElementById("mult");
const elementDiv    = document.getElementById("div");

// Nút = và C
const elementEqual  = document.getElementById("equal");
const elementCancel = document.getElementById("cancel");


// B: Đăng ký sự kiện
// Nút số
elementNum1.addEventListener("click", function(){edit(1);}, false);
elementNum2.addEventListener("click", function(){edit(2);}, false);
elementNum3.addEventListener("click", function(){edit(3);}, false);
elementNum4.addEventListener("click", function(){edit(4);}, false);
elementNum5.addEventListener("click", function(){edit(5);}, false);
elementNum6.addEventListener("click", function(){edit(6);}, false);
elementNum7.addEventListener("click", function(){edit(7);}, false);
elementNum8.addEventListener("click", function(){edit(8);}, false);
elementNum9.addEventListener("click", function(){edit(9);}, false);
elementNum0.addEventListener("click", function(){edit(0);}, false);

// Nút phép toán
elementAdd.addEventListener("click",   function(){update("+");}, false);
elementSub.addEventListener("click",   function(){update("-");}, false);
elementMult.addEventListener("click",  function(){update("*");}, false);
elementDiv.addEventListener("click",   function(){update("/");}, false);

// Nút = và C
elementEqual.addEventListener("click",  dspResult, false);
elementCancel.addEventListener("click", clear, false);


/** Xử lý khi nhấn số */
function edit(wkInput) {
  // Nếu trước đó cũng nhập số → ghép thêm số
  if (wkBefore === "0") {
    elementResult.innerHTML = Number(elementResult.innerHTML + wkInput); 
  }
  // Nếu trước đó nhập toán tử → thay bằng số mới
  else {
    elementResult.innerHTML = wkInput;
    wkFirst = "0";   // Tắt cờ lần đầu
    wkBefore = "0";  // Ghi nhớ vừa nhập số
  }
}

/** Xử lý khi nhấn nút phép toán (+ - * /) */
function update(calcType) {
  // Nếu trước đó nhập số
  if (wkBefore === "0") {
    // Nếu không phải lần đầu → gọi hàm tính toán
    if (wkFirst != "1") {
      elementCalcLog.innerHTML = elementCalcLog.innerHTML + Number(elementResult.innerHTML) + calcType;
      calculator();
    }
    // Nếu là lần đầu → ghi log
    else {
      elementCalcLog.innerHTML = elementResult.innerHTML + calcType;
      wkFirst = "0";
    }
  }
  // Nếu trước đó nhập toán tử → thay thế toán tử cuối trong log
  else {
    elementCalcLog.innerHTML = elementCalcLog.innerHTML.slice(0, -1) + calcType;
  }

  // Lưu toán tử vừa nhập
  wkCalc = calcType;
  wkBefore = "1"; // Ghi nhớ vừa nhập toán tử
}

/** Xử lý khi nhấn = */
function dspResult() {
  // Chỉ xử lý khi không phải lần đầu và trước đó nhập số
  if (wkFirst != "1" && wkBefore == "0") {
    // Ghi thêm số cuối vào log
    elementCalcLog.innerHTML = elementCalcLog.innerHTML + Number(elementResult.innerHTML);

    // Thực hiện phép tính
    calculator();

    // Ghi nhớ vừa nhấn =
    wkCalc = "=";
    wkBefore = "1";
  }
}

/** Xử lý khi nhấn C (xóa toàn bộ) */
function clear() {
  elementResult.innerHTML = "0";  // Reset kết quả
  elementCalcLog.innerHTML = "";  // Reset log
  wkFirst = "1";                  // Reset cờ lần đầu
  wkTotal = 0;                    // Reset tổng
  wkCalc = "";                    // Reset toán tử
  wkBefore = "1";                 // Ghi nhớ trạng thái vừa nhập toán tử
}

/** Thực hiện tính toán */
function calculator() {
  switch (wkCalc) {
    case "+": // Cộng
      wkTotal = wkTotal + Number(elementResult.innerHTML);
      break;

    case "-": // Trừ
      wkTotal = wkTotal - Number(elementResult.innerHTML);
      break;

    case "*": // Nhân
      wkTotal = wkTotal * Number(elementResult.innerHTML);
      break;

    case "/": // Chia
      if (Number(elementResult.innerHTML) === 0) {
        alert("Không thể chia cho 0!");
        clear();
        return;
      }
      wkTotal = wkTotal / Number(elementResult.innerHTML);
      break;

    default:  // Lần đầu
      wkTotal = Number(elementResult.innerHTML);
      break;
  }

  // Hiển thị kết quả ra màn hình
  elementResult.innerHTML = wkTotal;
}

/* bấm nút dc                     */
document.addEventListener("keydown", keydownEvent, false);

function keydownEvent(event) {
  // Nếu là số 0–9
  if (["0","1","2","3","4","5","6","7","8","9"].includes(event.key)) {
    edit(event.key);
  }

  // Nếu là toán tử
  if (["+", "-", "*", "/"].includes(event.key)) {
    update(event.key);
  }

  // Nếu là Enter hoặc =
  if (["Enter", "="].includes(event.key)) {
    dspResult();
  }

  // Nếu là C hoặc phím xoá
  if (["c", "C", "Escape", "Backspace", "Delete"].includes(event.key)) {
    clear();
  }
}

