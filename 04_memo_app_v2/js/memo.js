"use strict";

//  Khi trang load xong
window.addEventListener("DOMContentLoaded", function () {
  if (typeof localStorage === "undefined") {
    window.alert("このブラウザはLocal Storage機能が実装されていません");
    return;
  } else {
    viewStorage();             // Hiển thị dữ liệu lúc mở trang
    saveLocalStorage();        // nút lưu
    selectTable();             // nút chọn
    delLocalStorage();         // nút xóa
    allClearLocalStorage();    // xóa all
  }
}, false);

// 1. Lưu LocalStorage
function saveLocalStorage() {
  const save = document.getElementById("save");

  save.addEventListener("click", function (e) {
    e.preventDefault();

    const key = document.getElementById("textKey").value;
    const memo = document.getElementById("textMemo").value;

    if (key === "" || memo === "") {
      alert("Key と Memo を入力してください。");
      return;
    }

    let w_confirm = window.confirm(
      "このページの内容\n" +
      "Key : " + key + "\n" +
      "Memo : " + memo + "\n\n" +
      "保存しますか？"
    );

    if (w_confirm === true) {

      localStorage.setItem(key, memo); // ghi đè / thêm mới

      viewStorage();

      document.getElementById("textKey").value = "";
      document.getElementById("textMemo").value = "";

      window.alert("LocalStorage に " + key + " " + memo + " のデータを保存しました。");
    }
  }, false);
}

// 2.  Nút chọn data
function selectTable() {
  const select = document.getElementById("select");

  select.addEventListener("click", function (e) {
    e.preventDefault();
    selectCheckBox("select");     // version-up3 : truyền mode = select
  }, false);
}

// 3.  Hàm xử lý checkbox (dùng chung)
// mode = "select" → chỉ chọn 1
// mode = "del"    → chọn 1+
function selectCheckBox(mode) {

  let w_cnt = 0;                    // số lượng checkbox được chọn
  let chkbox1 = document.getElementsByName("chkbox1");
  const table1 = document.getElementById("table1");

  let w_textKey = "";
  let w_textMemo = "";

  for (let i = 0; i < chkbox1.length; i++) {

    if (chkbox1[i].checked) {

      if (w_cnt === 0) {
        // lấy dòng đầu tiên được chọn
        w_textKey = table1.rows[i + 1].cells[1].textContent;
        w_textMemo = table1.rows[i + 1].cells[2].textContent;

        document.getElementById("textKey").value = w_textKey;
        document.getElementById("textMemo").value = w_textMemo;
      }
      w_cnt++;
    }
  }

  //  Điều kiện mode = select 
  if (mode === "select") {
    if (w_cnt === 1) {
      return w_cnt;    // OK
    } else {
      window.alert("1つ選択（select）してください。");
      return 0;
    }
  }

  //  Điều kiện mode = del 
  if (mode === "del") {
    if (w_cnt >= 1) {
      return w_cnt;
    } else {
      window.alert("1つ以上選択（select）してください。");
      return 0;
    }
  }

  return 0;
}

// 4. Xóa 1 dòng localStorage
function delLocalStorage() {
  const del = document.getElementById("del");

  del.addEventListener("click", function (e) {
    e.preventDefault();

    // kiểm tra theo mode = "del"
    let selCount = selectCheckBox("del");

    if (selCount >= 1) {

      let chkbox1 = document.getElementsByName("chkbox1");
      const table1 = document.getElementById("table1");

      let rowIndex = -1;
      for (let i = 0; i < chkbox1.length; i++) {
        if (chkbox1[i].checked) {
          rowIndex = i;
          break;
        }
      }

      const key = table1.rows[rowIndex + 1].cells[1].textContent;
      const memo = table1.rows[rowIndex + 1].cells[2].textContent;

      let w_confirm = window.confirm(
        "LocalStorageから選択されている " + selCount +
        " 件を削除（delete）しますか？"
      );

      if (w_confirm === true) {

        for (let i = chkbox1.length - 1; i >= 0; i--) {
          if (chkbox1[i].checked) {
            const key2 = table1.rows[i + 1].cells[1].textContent;
            localStorage.removeItem(key2);
          }
        }

        viewStorage();
        document.getElementById("textKey").value = "";
        document.getElementById("textMemo").value = "";

        window.alert("LocalStorage から " + selCount + " 件を削除しました。");
      }
    }
  }, false);
}

// 5. Xóa toàn bộ
function allClearLocalStorage() {
  const allclear = document.getElementById("allClear");

  allclear.addEventListener("click", function (e) {
    e.preventDefault();

    let w_confirm = confirm(
      "LocalStorage のデータをすべて削除します。\nよろしいですか？"
    );

    if (w_confirm === true) {
      localStorage.clear();
      viewStorage();

      document.getElementById("textKey").value = "";
      document.getElementById("textMemo").value = "";

      window.alert("LocalStorage のデータをすべて削除しました。");
    }
  }, false);
}

// 6. Hiển thị storage
function viewStorage() {
  const list = document.getElementById("list");

  list.innerHTML = "";

  for (let i = 0; i < localStorage.length; i++) {

    const w_key = localStorage.key(i);
    const w_value = localStorage.getItem(w_key);

    let tr = document.createElement("tr");
    let td1 = document.createElement("td");
    let td2 = document.createElement("td");
    let td3 = document.createElement("td");

    td1.innerHTML = "<input name='chkbox1' type='checkbox'>";
    td2.textContent = w_key;
    td3.textContent = w_value;

    tr.appendChild(td1);
    tr.appendChild(td2);
    tr.appendChild(td3);

    list.appendChild(tr);
  }

  $("#table1").trigger("update");
}

// 7. tablesorter init
$(document).ready(function () {
  $("#table1").tablesorter({
    sortList: [[1, 0]]
  });
});
