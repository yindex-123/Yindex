"use strict";

// Khi trang load xong
window.addEventListener("DOMContentLoaded", function () {
  if (typeof localStorage === "undefined") {
    Swal.fire({
      title: "Memo app",
      html: "このブラウザはLocal Storage機能が実装されていません。",
      type: "error",
      allowOutsideClick: false
    });
    return;
  } else {
    viewStorage();             // Hiển thị dữ liệu lúc mở trang
    saveLocalStorage();        // nút lưu
    selectTable();             // nút chọn
    delLocalStorage();         // nút xóa
    allClearLocalStorage();    // xóa all
    initTrashIconEvent();      // thùng rác 
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
      Swal.fire({
        title: "Memo app",
        html: "Key、Memoはいずれも必須です。",
        type: "error",
        allowOutsideClick: false
      });
      return;
    }

    let w_msg =
      "LocalStorageへ\n「Key：" + key + "」「Memo：" + memo +
      "」\n保存（save）しますか？";

    Swal.fire({
      title: "Memo app",
      html: w_msg.replace(/\n/g, "<br>"),
      type: "info",
      showCancelButton: true,
      allowOutsideClick: false
    }).then(function (result) {
      if (result.value) {
        localStorage.setItem(key, memo);

        Swal.fire({
          title: "Memo app",
          html: "LocalStorageに「" + key + "」「" + memo + "」を保存しました。",
          type: "success",
          allowOutsideClick: false
        });

        viewStorage();
        document.getElementById("textKey").value = "";
        document.getElementById("textMemo").value = "";
      }
    });
  }, false);
}


// 2. Nút chọn
function selectTable() {
  const select = document.getElementById("select");

  select.addEventListener("click", function (e) {
    e.preventDefault();
    selectCheckBox("select");
  }, false);
}


// 3. Hỗ trợ kiểm tra checkbox
function selectCheckBox(mode) {
  let w_cnt = 0;
  let chkbox1 = document.getElementsByName("chkbox1");
  const table1 = document.getElementById("table1");

  for (let i = 0; i < chkbox1.length; i++) {
    if (chkbox1[i].checked) {
      if (w_cnt === 0) {
        const key = table1.rows[i + 1].cells[1].textContent;
        const memo = table1.rows[i + 1].cells[2].textContent;

        document.getElementById("textKey").value = key;
        document.getElementById("textMemo").value = memo;
      }
      w_cnt++;
    }
  }

  if (mode === "select") {
    if (w_cnt === 1) return w_cnt;

    Swal.fire({
      title: "Memo app",
      html: "1つ選択（select）してください。",
      type: "error",
      allowOutsideClick: false
    });
    return 0;
  }

  if (mode === "del") {
    if (w_cnt >= 1) return w_cnt;

    Swal.fire({
      title: "Memo app",
      html: "1つ以上選択（select）してください。",
      type: "error",
      allowOutsideClick: false
    });
    return 0;
  }

  return 0;
}


// 4. Xóa nhiều dòng
function delLocalStorage() {
  const del = document.getElementById("del");

  del.addEventListener("click", function (e) {
    e.preventDefault();

    let selCount = selectCheckBox("del");

    if (selCount >= 1) {
      Swal.fire({
        title: "Memo app",
        html: selCount + " 件を削除しますか？",
        type: "warning",
        showCancelButton: true,
        allowOutsideClick: false
      }).then(function (result) {
        if (result.value) {
          let chkbox1 = document.getElementsByName("chkbox1");
          const table1 = document.getElementById("table1");

          for (let i = chkbox1.length - 1; i >= 0; i--) {
            if (chkbox1[i].checked) {
              const key = table1.rows[i + 1].cells[1].textContent;
              localStorage.removeItem(key);
            }
          }

          viewStorage();
          document.getElementById("textKey").value = "";
          document.getElementById("textMemo").value = "";

          Swal.fire({
            title: "Memo app",
            html: selCount + " 件を削除しました。",
            type: "success",
            allowOutsideClick: false
          });
        }
      });
    }
  }, false);
}


// 5. Xóa toàn bộ
function allClearLocalStorage() {
  const allclear = document.getElementById("allClear");

  allclear.addEventListener("click", function (e) {
    e.preventDefault();

    Swal.fire({
      title: "Memo app",
      html: "LocalStorage のデータをすべて削除します。よろしいですか？",
      type: "warning",
      showCancelButton: true,
      allowOutsideClick: false
    }).then(function (result) {
      if (result.value) {
        localStorage.clear();
        viewStorage();

        document.getElementById("textKey").value = "";
        document.getElementById("textMemo").value = "";

        Swal.fire({
          title: "Memo app",
          html: "すべてのデータを削除しました。",
          type: "success",
          allowOutsideClick: false
        });
      }
    });
  }, false);
}


// 6. Hiển thị danh sách
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
    let td4 = document.createElement("td");

    td1.innerHTML = "<input name='chkbox1' type='checkbox'>";
    td2.textContent = w_key;
    td3.textContent = w_value;

    td4.innerHTML = "<span class='trash' style='cursor:pointer;'>🗑️</span>";
    td4.dataset.key = w_key;
    td4.dataset.memo = w_value;

    tr.appendChild(td1);
    tr.appendChild(td2);
    tr.appendChild(td3);
    tr.appendChild(td4);

    list.appendChild(tr);
  }

  $("#table1").trigger("update");
}

// 7. Event thùng rác (event delegation)
function initTrashIconEvent() {
  const table1 = document.getElementById("table1");

  table1.addEventListener("click", function (e) {
    let target = e.target;

    if (
      !target.classList.contains("trash") &&
      target.parentElement?.classList.contains("trash")
    ) {
      target = target.parentElement;
    }

    if (target.classList.contains("trash")) {
      const td = target.parentElement;
      const key = td.dataset.key;
      const memo = td.dataset.memo;

      Swal.fire({
        title: "Memo app",
        html:
          "Key：" + key + "<br>" +
          "Memo：" + memo + "<br><br>" +
          "このデータを削除しますか？",
        type: "warning",
        showCancelButton: true,
        allowOutsideClick: false
      }).then(function (result) {
        if (result.value) {
          localStorage.removeItem(key);
          viewStorage();

          Swal.fire({
            title: "Memo app",
            html:
              "Key：" + key + "<br>" +
              "Memo：" + memo + "<br><br>" +
              "削除しました。",
            type: "success",
            allowOutsideClick: false
          });
        }
      });
    }
  }, false);
}


 //  8. tablesorter init
$(document).ready(function () {
  $("#table1").tablesorter({
    sortList: [[1, 0]]
  });
});
