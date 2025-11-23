import * as commentController from './controllers/comments-controller.js';
import * as loginModalController from './controllers/login-modal-controller.js';
import * as mobileMenuController from './controllers/mobile-menu-controller.js';
import * as ratingController from './controllers/rating-controller.js';
import * as windowController from './controllers/window-controller.js';

ratingController.init();
loginModalController.init();
mobileMenuController.init();
windowController.init();
commentController.init();

// Search
document.querySelector('.search-icon').addEventListener('click', function() {
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');
    // Chuyển đổi giữa hiển thị và ẩn
    if (searchInput.classList.contains('hidden')) {
        searchInput.classList.remove('hidden');
        searchButton.classList.remove('hidden');
        searchInput.focus(); // Đưa con trỏ vào ô tìm kiếm
    } else {
        searchInput.classList.add('hidden');
        searchButton.classList.add('hidden');
    }
});
document.getElementById('search-input').addEventListener('keyup', function(event) {
    if (event.key === 'Enter') {
        searchMenuItems(); // Gọi hàm tìm kiếm khi nhấn Enter
    }
});
document.getElementById('search-button').addEventListener('click', function() {
    searchMenuItems(); // Gọi hàm tìm kiếm khi nhấn nút
});

function searchMenuItems() {
    const searchValue = document.getElementById('search-input').value.toLowerCase(); // Giá trị tìm kiếm
    const menuItems = document.querySelectorAll('.card-item'); // Lấy tất cả các mục menu
    menuItems.forEach((item) => {
        const itemName = item.querySelector('.food-description-container h4').textContent.toLowerCase();
        if (itemName.includes(searchValue)) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
}
// End-search


//Begin-Api Food
const search = document.getElementById('search'),
submit = document.getElementById('submit'),
mealsEl = document.getElementById('meals'),
resultHeading = document.getElementById('result-heading'),
single_mealEl = document.getElementById('single-meal');
//khởi tạo biến
// Search meal and fetch from API
function searchMeal(e) {
    e.preventDefault();
    //ngăn chặn hành vi mặc định của sự kiện
    // Clear single meal
    single_mealEl.innerHTML = '';
    //biến đại diện cho phần tử html
    // Get search term
    const term = search.value;
//lấy giá trị mà người dùng đã nhập vào trường nhập liệu này.
    // Check for empty
    if(term.trim()) {//được sử dụng để loại bỏ các khoảng trắng ở đầu và cuối của từ khóa.
        //tìm kiếm thông tin về món ăn dựa trên từ khóa
        fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`)
        .then(res => res.json())
        .then(data => {
            console.log(data);
            resultHeading.innerHTML = `<h2>Search results for ${term}:</h2>`;
            if(data.meals === null) {
                resultHeading.innerHTML =`<p>There are no search results. Try again!</p>`;
                //một tiêu đề "Search results for [từ khóa tìm kiếm]" nếu có kết quả tìm kiếm. Nếu không có kết quả, một thông báo "There are no search results. Try again!" được hiển thị.
            } else {
                mealsEl.innerHTML = data.meals.map(meal => `
                <div class="meal">
                <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
                <div class="meal-info" data-mealID="${meal.idMeal}">
                    <h3>${meal.strMeal}</h3>
                </div>
                </div>
                `)//hihiển thị dưới dạng một phần tử .meal, bao gồm hình ảnh của món ăn và tên món ăn.
                .join('');
            }
        });
        // Clear search text
        search.value = '';//trường nhập liệu sẽ được xóa sạch sau mỗi lần tìm kiếm.
    } else {
        alert('Please enter a search value');//nhắc nhở người dùng nhập một từ khóa tìm kiếm trước khi nhấn nút tìm kiếm hoặc nhấn Enter.
    }
}
// Fetch meal by ID
function getMealById(mealID) {//để lấy thông tin về một món ăn từ API ,sau đó thêm thông tin về món ăn đó vào DOM.
    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`)
    //được sử dụng để gửi yêu cầu GET đến API themealdb.com để lấy thông tin về món ăn có mealID tương ứng.
    .then(res => res.json())//để xử lý dữ liệu JSON được trả về
    .then(data => {
        const meal = data.meals[0];
        //Dữ liệu này được truy cập thông qua data.meals[0], với meal là đối tượng chứa thông tin về món ăn đầu tiên trong danh sách món ăn.
        addMealToDOM(meal); // để thêm thông tin về món ăn đó vào DOM
    });
}
// Fetch random meal from API
function getRandomMeal() {//để lấy thông tin về một món ăn ngẫu nhiên từ API
    // Clear meals and heading
        mealsEl.innerHTML = '';//Dòng này xóa sạch nội dung bên trong phần tử có ID là mealsEl
        fetch(`https://www.themealdb.com/api/json/v1/1/random.php`)
        //: Dòng này gửi một yêu cầu GET đến API themealdb.com để lấy thông tin về một món ăn ngẫu nhiên.
        .then(res => res.json())//Sau khi nhận được phản hồi từ API, hàm .then() được sử dụng để xử lý dữ liệu JSON được trả về
        .then(data => {// Dữ liệu này chứa thông tin về một món ăn ngẫu nhiên và được truy cập thông qua data.meals[0].
            const meal = data.meals[0]//gán thông tin về món ăn ngẫu nhiên vào biến meal
            addMealToDOM(meal);//để thêm thông tin về món ăn ngẫu nhiên vào DOM.
    });
}
// Add meal to DOM
function addMealToDOM(meal) {//thêm thông tin về một món ăn vào DOM,
    const ingredients = [];//tạo ra một mảng rỗng được gán cho biến
    for(let i = 1; i <= 20; i++) {
        if(meal[`strIngredient${i}`]) {
            ingredients.push(`${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`);
            //lặp for được sử dụng để duyệt qua tất cả các thành phần của món ăn. Trong trường hợp của API themealdb.com, các thông tin về thành phần và lượng đo được lưu trữ trong các trường dữ liệu strIngredient1, strIngredient2, ..., 
        } else {
            break;
            // Nếu không, điều này cho biết chúng ta đã đến cuối danh sách các thành phần và vòng lặp được dừng bằng cách sử dụng lệnh break.
        }
    }
    //Hiển thị thông tin của món ăn
    single_mealEl.innerHTML = `
    <div class="single-meal">
        <h1>${meal.strMeal}</h1>
        <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
        <div class="single-meal-info">
            ${meal.strCategory ? `<p>${meal.strCategory}</p>` : ''}
            ${meal.strArea ? `<p>${meal.strArea}</p>` : ''}
        </div>
        <div class="main">
            <p>${meal.strInstructions}</p>
            <h2>Ingredients</h2>
            <ul>
            ${ingredients.map(ing => `<li>${ing}</li>`).join('')}
        </ul>
        </div>
    </div>
    `;
}
// Event listeners
submit.addEventListener('submit', searchMeal);
// Tìm kiếm  món ăn
random.addEventListener('click', getRandomMeal);
//hiển thị một món ăn ngẫu nhiên.
mealsEl.addEventListener('click', e => {
    const mealInfo = e.path.find(item => {
        if(item.classList) {
            return item.classList.contains('meal-info');
        } else {
            return false;
        }
    });//Khi người dùng nhấn "click" vào một món ăn trong danh sách này, trình xử lý được chạy.

    if(mealInfo) {
        const mealID = mealInfo.getAttribute('data-mealid');
        getMealById(mealID);
    }
    //hiển thị thông tin chi tiết về món ăn đó.
});
//End API


// Begin Form
const modalLogin = document.querySelector('.modal-login');
const modalForgotPassword = document.querySelector('.modal-forgot-password');
const modalRegister = document.querySelector('.modal-register');

// Mở form Sign in
document.querySelector('.open-modal-btn').addEventListener('click', () => {
    modalLogin.style.display = 'flex';
});

// Đóng modal khi nhấn vào dấu x hoặc bên ngoài form
document.querySelectorAll('.x-modal').forEach(x => {
    x.addEventListener('click', () => {
        modalLogin.style.display = 'none';
        modalForgotPassword.style.display = 'none';
        modalRegister.style.display = 'none';
    });
});

// Nhấn vào liên kết "Forgot password?"
document.getElementById('forgot-password-link').addEventListener('click', (e) => {
    e.preventDefault();
    modalLogin.style.display = 'none';
    modalForgotPassword.style.display = 'flex';
});

// Nhấn vào liên kết "Register" từ Sign in
document.getElementById('register-link').addEventListener('click', (e) => {
    e.preventDefault();
    modalLogin.style.display = 'none';
    modalRegister.style.display = 'flex';
});

// Quay lại Sign in từ Forgot Password
document.getElementById('back-to-login').addEventListener('click', (e) => {
    e.preventDefault();
    modalForgotPassword.style.display = 'none';
    modalLogin.style.display = 'flex';
});

// Quay lại Sign in từ Sign up
document.getElementById('back-to-login-from-register').addEventListener('click', (e) => {
    e.preventDefault();
    modalRegister.style.display = 'none';
    modalLogin.style.display = 'flex';
});
// End Form