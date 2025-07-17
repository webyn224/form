// ==============================
// メニュー開閉
// ==============================
const drawerBtn = document.getElementById("js-drawer-icon");
const drawerMenu = document.getElementById("js-drawer-content");
const body = document.body;
const drawerLinks = document.querySelectorAll(".drawer-content__link");

drawerBtn.addEventListener("click", () => {
  drawerBtn.classList.toggle("is-active");
  drawerMenu.classList.toggle("is-active");
  body.classList.toggle("is-fixed");
});

// ==============================
// メニュー内リンクを押したら閉じる
// ==============================
drawerLinks.forEach(link => {
    link.addEventListener("click", () => {
      drawerBtn.classList.remove("is-active");
      drawerMenu.classList.remove("is-active");
      document.body.classList.remove("is-fixed");
    });
  });

// ==============================
// ファイルのアップロード
// ==============================
// HTMLが読み込まれてから実行されるようにする
window.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.image-upload-box').forEach(box => {
    const input = box.querySelector('.upload-input');
    const preview = box.querySelector('.image-preview');
    const deleteBtn = box.querySelector('.delete-btn');

    if (!input || !preview || !deleteBtn) return; // 安全確認

    // プレビュークリックでファイル選択
    preview.addEventListener('click', () => {
      input.click();
    });

    // ファイル選択時
    input.addEventListener('change', () => {
      const file = input.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = function (e) {
        preview.innerHTML = '';
        const img = document.createElement('img');
        img.src = e.target.result;
        img.style.maxWidth = '100%';
        img.style.height = 'auto';
        preview.appendChild(img);
        deleteBtn.style.display = 'inline-block';
      };
      reader.readAsDataURL(file);
    });

    // 削除ボタン
    deleteBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      input.value = '';
      preview.innerHTML = '<p>写真を選択</p>';
      deleteBtn.style.display = 'none';
    });
  });
});


// ==============================
// ギフトカードを追加
// ==============================
document.getElementById('card-addition').addEventListener('click', function () {
  const template = document.getElementById('card-template');
  const wrapper = document.getElementById('card-fields-wrapper');

  // テンプレートからクローンを作成
  const clone = template.content.cloneNode(true);

  // name属性に [] をつけて配列化（送信時）
  clone.querySelectorAll('input').forEach(input => {
    const name = input.getAttribute('name');
    if (name && !name.endsWith('[]')) {
      input.setAttribute('name', name + '[]');
    }
  });

  // 画像プレビューのイベント登録
  const imageBox = clone.querySelector('.image-upload-box');
  const fileInput = imageBox.querySelector('input[type="file"]');
  const preview = imageBox.querySelector('.image-preview');
  const deleteBtn = imageBox.querySelector('.delete-btn');

  preview.addEventListener('click', () => fileInput.click());

  fileInput.addEventListener('change', () => {
    const file = fileInput.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        preview.innerHTML = `<img src="${reader.result}" alt="preview" />`;
        deleteBtn.style.display = 'block';
      };
      reader.readAsDataURL(file);
    }
  });

  deleteBtn.addEventListener('click', () => {
    fileInput.value = '';
    preview.innerHTML = `<p>写真を選択</p>`;
    deleteBtn.style.display = 'none';
  });


  // 削除ボタンのイベント登録
  const removeBtn = clone.querySelector('.card-remove-btn');
  if (removeBtn) {
    removeBtn.addEventListener('click', function () {
      this.closest('.contact__fields-box').remove();
    });
  }

  // DOMに追加
  wrapper.appendChild(clone);
});

// ==============================
// ギフトカード画像に連番をつける
// ==============================
  const formData = new FormData();

document.querySelectorAll('.card-box').forEach((box, index) => {
  const imageInput = box.querySelector('input[type="file"]');
  const file = imageInput?.files[0];
  if (file) {
    formData.append(`purchaseImage${index}`, file);
  }
});
// ==============================
// 本人確認の追加画像にに連番をつける
// ==============================
const additionalInputs = document.querySelectorAll('#id-fields-wrapper input[type="file"]');
additionalInputs.forEach((input, index) => {
  const file = input?.files[0];
  if (file) {
    formData.append(`additionalImage${index}`, file);
  }
});


// ==============================
// 本人確認書類を追加
// ==============================
document.getElementById('id-addition').addEventListener('click', function () {
  const template = document.getElementById('id-template');
  const wrapper = document.getElementById('id-fields-wrapper');
  const clone = template.content.cloneNode(true);

  const imageBox = clone.querySelector('.image-upload-box');
  const fileInput = imageBox.querySelector('input[type="file"]');
  const preview = imageBox.querySelector('.image-preview');
  const deleteBtn = imageBox.querySelector('.delete-btn');

  // 画像選択
  preview.addEventListener('click', () => fileInput.click());

  fileInput.addEventListener('change', () => {
    const file = fileInput.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        preview.innerHTML = `<img src="${reader.result}" alt="preview" />`;
        deleteBtn.style.display = 'block';
      };
      reader.readAsDataURL(file);
    }
  });

  // 画像削除
  deleteBtn.addEventListener('click', () => {
    fileInput.value = '';
    preview.innerHTML = `<p>写真を選択</p>`;
    deleteBtn.style.display = 'none';
  });

  //  追加ブロック全体の削除
  const removeBtn = clone.querySelector('.id-remove-btn');
  removeBtn.addEventListener('click', function () {
    this.closest('.form__field').remove();
  });

  wrapper.appendChild(clone);
});

// ==============================
// 入力中に自動でハイフン追加
// ==============================

document.getElementById('card-name').addEventListener('input', function () {
  let value = this.value.replace(/[^a-zA-Z0-9]/g, '').slice(0, 12); // 英数字のみ＆最大12桁
  let formatted = value.match(/.{1,4}/g)?.join('-') ?? '';
  this.value = formatted;
});

// ==============================
// 振り込み予定金額の計算
// ==============================

// 入力変更時にイベントを設定（inputにも対応）
document.querySelectorAll('#card-price, input[name="contact-type"], input[name="receipt_select"]').forEach(el => {
  el.addEventListener('input', calculateAmount);
  el.addEventListener('change', calculateAmount);
});

function calculateAmount() {
  const price = parseInt(document.getElementById('card-price').value, 10);
  const visitInput = document.querySelector('input[name="times"]:checked');
  const proofInput = document.querySelector('input[name="receipt_select"]:checked');

  if (!price || !visitInput || !proofInput) {
    document.getElementById('result').textContent = '-';
    return;
  }

  const visit = visitInput.value; // "first" or "second"
  const proof = proofInput.value; // "yes" or "no"

  let rate = 0;

  if (visit === 'first') {
    rate = (proof === 'yes') ?
      (price < 30000 ? 0.92 : price < 50000 ? 0.93 : price < 100000 ? 0.94 : 0.95) :
      0.9;
  } else {
    rate = (proof === 'yes') ?
      (price < 30000 ? 0.82 : price < 50000 ? 0.83 : price < 100000 ? 0.84 : 0.85) :
      (price < 30000 ? 0.8 : price < 50000 ? 0.81 : price < 100000 ? 0.82 : 0.83);
  }

  const result = Math.floor(price * rate).toLocaleString();
  document.getElementById('result').textContent = `¥${result}`;
}

// ==============================
// スプレッドシートに連携
// ==============================
document.querySelector("form").addEventListener("submit", async function (e) {
  e.preventDefault();

  const form = e.target;
  const formData = new FormData();

  // 基本情報
  formData.append("name", form["your-name"].value);
  formData.append("email", form["your-email"].value);
  formData.append("visit", form["times"].value);
  formData.append("accountType", form["account-type"].value);
  formData.append("idType", form["id-type"].value);
  formData.append("bankName", form["bank-name"].value);
  formData.append("branchName", form["branch-name"].value);
  formData.append("accountNum", form["account-num"].value);
  formData.append("accountName", form["account-name"].value);

  // 本人確認画像
  if (form["frontImage"].files[0]) {
    formData.append("frontImage", form["frontImage"].files[0]);
  }
  if (form["backImage"].files[0]) {
    formData.append("backImage", form["backImage"].files[0]);
  }

  // 追加本人確認画像（複数）
  const extraImageInputs = form.querySelectorAll('input[name="additionalImage"]');
  extraImageInputs.forEach((input, index) => {
    if (input.files[0]) {
      formData.append(`additionalImage${index}`, input.files[0]);
    }
  });

  // ギフトカード情報（繰り返し対応）
  const cardBoxes = form.querySelectorAll(".card-box");
  formData.append("cardCount", cardBoxes.length);

  cardBoxes.forEach((box, i) => {
    const cardNumber = box.querySelector('input[name="card-name"]')?.value || '';
    const cardPrice = box.querySelector('input[name="card-price"]')?.value || '';
    const purchase = box.querySelector('input[name="purchase"]')?.value || '';
    const receipt = box.querySelector('input[name="receipt_select"]:checked')?.value || '';
    const imageInput = box.querySelector('input[name="purchaseImage"]');

    formData.append(`cardNumber${i}`, cardNumber);
    formData.append(`cardPrice${i}`, cardPrice);
    formData.append(`purchase${i}`, purchase);
    formData.append(`receipt${i}`, receipt);

    if (imageInput?.files[0]) {
      formData.append(`purchaseImage${i}`, imageInput.files[0]);
    }
  });

  // 送信先URL（GASデプロイURLに差し替えてください）
  const endpoint = "https://script.google.com/macros/s/AKfycbwo_k6yxrtszaQpRTpuVbaG5zBulX4LF_dearDG-pXgJV6RPM4RHHpnKLkhZnR4e16iAA/exec";
  console.log("=== formDataの中身 ===");
for (let [key, value] of formData.entries()) {
  console.log(key, value);
}


  try {
    const res = await fetch(endpoint, {
      method: "POST",
      body: formData,
    });

    const text = await res.text();
    alert("送信結果: " + text);
  } catch (err) {
    alert("送信エラー: " + err.message);
  }
});