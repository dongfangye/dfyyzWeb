let books = [];
let selectedAuthor = '全部';
let selectedCategory = '全部';
let selectedSubCategory = '全部';

// 作者列表写死
const authors = ['全部','XXX'];

// 分类列表写死
const categories = [
    { name: '文学', sub: ['侦探小说','日本轻小说' '中国散文'] },
    { name: '漫画', sub: ['日本漫画', '网络漫画'] },
    { name: '技术', sub: ['C++', 'Qt', 'Web开发'] }
];

// 加载 JSON 数据
fetch('data/books.json')
    .then(response => response.json())
    .then(data => {
        books = data;
        initAuthors();
        initCategories();
        renderBooks();
    })
    .catch(err => console.error('加载 books.json 出错:', err));

// 初始化作者按钮
function initAuthors() {
    const container = document.getElementById('author-buttons');
    authors.forEach(author => {
        const btn = document.createElement('button');
        btn.textContent = author;
        if (author === '全部') btn.classList.add('active');
        btn.addEventListener('click', () => {
            document.querySelectorAll('.author-buttons button').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            selectedAuthor = author;
            renderBooks();
        });
        container.appendChild(btn);
    });

    // 作者搜索
    const searchInput = document.getElementById('author-search');
    searchInput.addEventListener('input', () => {
        const keyword = searchInput.value.toLowerCase();
        container.innerHTML = '';
        authors.filter(a => a.toLowerCase().includes(keyword)).forEach(author => {
            const btn = document.createElement('button');
            btn.textContent = author;
            if (author === selectedAuthor) btn.classList.add('active');
            btn.addEventListener('click', () => {
                document.querySelectorAll('.author-buttons button').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                selectedAuthor = author;
                renderBooks();
            });
            container.appendChild(btn);
        });
    });
}

// 初始化分类
function initCategories() {
    const container = document.getElementById('category-sidebar');
    const ul = document.createElement('ul');
    categories.forEach(cat => {
        const li = document.createElement('li');
        li.textContent = cat.name;
        li.addEventListener('click', () => {
            const subUl = li.querySelector('ul');
            if (subUl) subUl.style.display = subUl.style.display === 'block' ? 'none' : 'block';
            selectedCategory = cat.name;
            selectedSubCategory = '全部';
            renderBooks();
        });

        if (cat.sub.length > 0) {
            const subUl = document.createElement('ul');
            subUl.classList.add('sub-category');
            cat.sub.forEach(sub => {
                const subLi = document.createElement('li');
                subLi.textContent = sub;
                subLi.addEventListener('click', (e) => {
                    e.stopPropagation();
                    selectedCategory = cat.name;
                    selectedSubCategory = sub;
                    renderBooks();
                });
                subUl.appendChild(subLi);
            });
            li.appendChild(subUl);
        }

        ul.appendChild(li);
    });
    container.appendChild(ul);
}

// 搜索书名
const bookSearchInput = document.getElementById('book-search');
bookSearchInput.addEventListener('input', () => {
    renderBooks();
});

// 渲染书架
function renderBooks() {
    const shelf = document.getElementById('book-shelf');
    shelf.innerHTML = '';

    // 获取书名搜索关键字
    const keyword = bookSearchInput.value.toLowerCase();

    books.forEach(book => {
        // 分类筛选
        if (selectedCategory !== '全部' && book.category !== selectedCategory) return;
        if (selectedSubCategory !== '全部' && book.subCategory !== selectedSubCategory) return;

        // 作者筛选
        if (selectedAuthor !== '全部' && book.author !== selectedAuthor) return;

        // 书名搜索
        if (keyword && !book.title.toLowerCase().includes(keyword)) return;

        // 创建书卡
        const card = document.createElement('div');
        card.classList.add('book-card');

        const img = document.createElement('img');
        img.src = book.cover; // 相对路径：images/xxx.jpg
        img.alt = book.title;

        const title = document.createElement('div');
        title.classList.add('title');
        title.textContent = book.title;

        card.appendChild(img);
        card.appendChild(title);
        shelf.appendChild(card);
    });
}
