


let changePassNam = `
    <h2>تغيير الاسم</h2>
                    <div class="change-name">
                        <label for="newName">اسم جديد:</label>
                        <br>
                        <input type="text" id="newName" value="owner">
                    </div>
                    <h2>تغيير كلمه السر</h2>
                    <div class="change-pass">
                        <label for="oldPassword">كلمة السر القديمة:</label>
                        <input type="password" id="oldPassword" required>
                        <br>
                        <label for="newPassword">كلمة السر الجديدة:</label>
                        <input type="password" id="newPassword" required>
                    </div>
                    <br>
                    <button type="submit">تغيير الاسم وكلمة السر</button>
`;
document.getElementById('changePasswordForm').innerHTML = changePassNam;

        // نموذج تغيير الاسم وكلمة السر
        document.getElementById('changePasswordForm').addEventListener('submit', function (event) {
            event.preventDefault();
            const oldPassword = document.getElementById('oldPassword').value;
            const newName = document.getElementById('newName').value;
            const newPassword = document.getElementById('newPassword').value;

            // البحث عن المالك وتحديث الاسم وكلمة السر
            database.ref('owners').once('value').then(snapshot => {
                let found = false;
                snapshot.forEach(childSnapshot => {
                    const owner = childSnapshot.val();
                    if (owner.pass === oldPassword) { // استخدم `pass` بدلاً من `password`
                        found = true;
                        childSnapshot.ref.update({
                            name: newName,
                            pass: newPassword // استخدم `pass` بدلاً من `password`
                        });
                    }
                });
                if (found) {
                    alert('تم تغيير الاسم وكلمة السر بنجاح!');
                    document.getElementById('changePasswordForm').reset();
                } else {
                    alert('كلمة السر القديمة غير صحيحة.');
                }
            }).catch(error => {
                console.error('حدث خطأ أثناء تحديث البيانات: ', error);
            });
        });