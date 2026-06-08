let books = [];
let selectedAuthor = '全部';
let selectedCategory = '全部';
let selectedSubCategory = '全部';

// 作者列表写死
const authors = ['全部', '川原砾', '丸山黄金', '伏濑', '谏山创', '爱七ひろ'];

// 分类列表写死
const categories = [
    {
        name: '文学',
        sub: ['小说', '散文']
    },
    {
        name: '动漫',
        sub: ['轻小说', '漫画']
    },
    {
        name: '技术',
        sub: ['C++', 'Qt', 'Web开发']
    }
];

// 加载JSON数据
fetch('/dfyyzWeb/data/books.json')
    .then(response => response.json())
    .then(data => {
        books = data;
        initAuthors();
        initCategories();
        renderBooks();
    });

// 初始化作者按钮
function initAuthors() {
    const container = document.getElementById('author-buttons');
    authors.forEach(author => {
        const btn = document.createElement('button');
        btn.textContent = author;
        if(author === '全部') btn.classList.add('active');
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
            if(author === selectedAuthor) btn.classList.add('active');
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
            // 切换子分类显示
            const subUl = li.querySelector('ul');
            if(subUl) subUl.style.display = subUl.style.display === 'block' ? 'none' : 'block';
            selectedCategory = cat.name;
            selectedSubCategory = '全部';
            renderBooks();
        });

        if(cat.sub.length > 0) {
            const subUl = document.createElement('ul');
            subUl.classList.add('sub-category');
            cat.sub.forEach(sub => {
                const subLi = document.createElement('li');
                subLi.textContent = sub;
                subLi.addEventListener('click', (e) => {
                    e.stopPropagation(); // 阻止父级点击
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

// 渲
