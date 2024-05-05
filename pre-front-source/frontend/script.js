"use strict";
var id = "1900012997"; //等会修改成从后端获取的id
var cur_detail_post = 1;
//axios的配置
axios.defaults.baseURL = "http://localhost:8080/";
var qs = Qs;
axios.defaults.headers.post["Content-Type"] =
	"application/x-www-form-urlencoded";

//关闭登录/注册界面，打开主页和顶部导航栏
function open_mainpage() {
	document.getElementsByClassName("login_or_signup")[0].style.display =
		"none";
	document.getElementsByClassName("navigator")[0].style.display = "block";
	document.getElementById("post_items").style.display = "block";
}

//退出登录，关闭主页、顶部导航栏和侧边栏，显示登录/注册界面
function logout() {
	document.getElementsByClassName("login_or_signup")[0].style.display =
		"block";
	document.getElementsByClassName("navigator")[0].style.display = "none";
	document.getElementById("post_items").style.display = "none";
	close_sidebar();
}

//每次刷新页面，加载背景，主页请求帖子

let start_index = 1
let search_start_index = 1
let favour_start_index = 1
let post_num = 20
let search_post_num = 20
let favour_post_num = 10
let avatar_url = ""
let search_keyword = ""
let is_searching = 0
let is_favour = 0

function queryPost(){
	return new Promise((resolve, reject) => {
		axios.post("treehole/queryPost", { 
			student_number: id ,startIndex:start_index,postNum:post_num
		}).then((response) => {
				let post_list = response.data.postList;
				let post_items = document.getElementById("post_items");
				console.log(post_list)
				for(let i=0;i<post_list.length;++i){
					let content = document.createElement("div");
					content.setAttribute("class","item");
	
					let post_id = document.createElement("span");
					post_id.setAttribute("class","post_id");
					post_id.innerHTML = "#" + post_list[i].postId;
					content.appendChild(post_id)
	
					let is_favour = document.createElement("span");
					is_favour.setAttribute("class","isfavored");
					if(post_list[i].isFavour == "true"){
						is_favour.innerHTML = "已收藏"//收藏的图标
					}else{
						is_favour.innerHTML = "未收藏"//未收藏的图标
					}
					content.appendChild(is_favour)
	
					let post_time = document.createElement("span");
					post_time.setAttribute("class","post_time");
					post_time.innerHTML = formatUnixTime(post_list[i].sendTime);
					content.appendChild(post_time)
	
					let sub_content = document.createElement("div");
					sub_content.setAttribute("class","sub_content");

					let sub_img = document.createElement("img");
					sub_img.setAttribute("class","host_head_icon");
					axios.post("user/queryStudentInfo", { student_number: post_list[i].senderId })
					.then((response) => {
						sub_img.src = response.data.avatarURL;
					}).catch((error) => {
						console.error(error);
					});
					sub_content.appendChild(sub_img);
	
					let post_content = document.createElement("span");
					post_content.setAttribute("class","host_element");
					post_content.innerHTML = post_list[i].content;
					sub_content.appendChild(post_content);
	
					let comment_list = document.createElement("ul");
					comment_list.setAttribute("class","comment_element");
					for(let j=0;j<post_list[i].CommentList.length;++j){
						let comment = document.createElement("li");
						comment.setAttribute("class","comment_preview");
						comment.innerHTML = post_list[i].CommentList[j].content;
						comment_list.appendChild(comment);
					}
					sub_content.appendChild(comment_list);
					content.appendChild(sub_content);
					content.onclick = function(){
						open_post(post_list[i].postId);
					}
					post_items.appendChild(content);
				}

				start_index += post_list.length;

				resolve("done");
			}).catch((error) => {
				console.error(error);
				reject(error);
			});
	});
}


function formatUnixTime(unixTimestamp) {
	const diff = new Date() - new Date(unixTimestamp * 1000);
	const days = Math.floor(diff / (24 * 60 * 60 * 1000));
	const hours = Math.floor((diff / (60 * 60 * 1000)) % 24);
	const minutes = Math.floor((diff / (60 * 1000)) % 60);
	const seconds = Math.floor((diff / 1000) % 60);
  
	let result = "";
	if (days > 0) {
	  result += `${days} 天 `;
	}
	
	if (hours > 0) {
	  result += `${hours} 小时 `;
	}
	
	if (minutes > 0) {
	  result += `${minutes} 分钟 `;
	}
	
	result += `${seconds} 秒前`;
	
	return result;
}

function scroll_bottom() {
	const scrollHeight = document.body.scrollHeight;
	const scrollTop = document.body.scrollTop;
	const clientHeight = document.body.clientHeight;
	console.log(scrollHeight,scrollTop,clientHeight);
	if (scrollHeight - scrollTop == clientHeight+1) {
	  // 已经滚动到了页面底部，执行相应的操作
	  console.log("已经滚动到了页面底部！");
	  query_more();
	}
  }

function init() {
	//从cookie中获取学号，如果过期，则跳转到登录界面
	id = document.cookie;
	id = document.cookie.replace(/(?:(?:^|.*;\s*)id\s*\=\s*([^;]*).*$)|^.*$/, "$1");
	console.log(document.cookie)
	console.log(id)
	if (id == "") {
		console.log("quit")
		logout();
		return;
	}
	//加载背景
	axios
		.post("user/queryStudentInfo", { student_number: id })
		.then((response) => {
			let backgroundURL = response.data.backgroundURL;
			console.log(backgroundURL);
			avatar_url = response.data.avatarURL;
			document.body.style.backgroundImage = `url(${backgroundURL})`;
		}).catch((error) => {
			console.error(error);
		});
	//主页请求帖子
	start_index = 1;
	search_start_index = 1;
	is_searching = 0;
	is_favour = 0;
	document.body.scrollTop = 0;
	queryPost();

	document.body.addEventListener("scroll", scroll_bottom);
}
init();

//打开侧边栏和遮罩层
function open_sidebar() {
	document.getElementsByClassName("mask")[0].style.display = "block";
	document.getElementsByClassName("sidebar")[0].style.display = "block";
}
//关闭侧边栏和遮罩层
function close_sidebar() {
	//让每种侧边栏的内容都不显示，【包括sidebar_title/buttons】（然后再打开指定的侧边栏内容）
	document.getElementById("sidebar_title").style.display = "none";
	document.getElementsByClassName("sidebar_buttons")[0].style.display =
		"none";
	for (let i = 0; i < 4; i++) {
		document.getElementsByClassName("sidebar_content")[i].style.display =
			"none";
	}
	//然后关闭整个的侧边栏和遮罩层
	document.getElementsByClassName("mask")[0].style.display = "none";
	document.getElementsByClassName("sidebar")[0].style.display = "none";
}
//方式1：点击关闭按钮
document.getElementsByClassName("close_sidebar")[0].onclick = close_sidebar;
//方式2：点击遮罩层
document.getElementsByClassName("mask")[0].onclick = close_sidebar;

//转换登录/注册
let turn_to_login_or_signup = document.getElementById(
	"turn_to_login_or_signup"
);
turn_to_login_or_signup.onclick = function () {
	var login_or_signup_button = document.getElementById(
		"login_or_signup_button"
	);
	if (turn_to_login_or_signup.innerHTML == "已有账号?") {
		turn_to_login_or_signup.innerHTML = "还未注册?";
		login_or_signup_button.innerHTML = "登录";
	} else if (turn_to_login_or_signup.innerHTML == "还未注册?") {
		turn_to_login_or_signup.innerHTML = "已有账号?";
		login_or_signup_button.innerHTML = "注册";
	}
};

//登录/注册
function login_or_signup() {
	//flag = "login"/"register"
	let button = document.getElementById("login_or_signup_button");
	let flag = button.innerHTML == "登录" ? "login" : "signup";
	let num = document.getElementById("stu_number"); //num.value是个字符串，所以无需转化
	let psw = document.getElementById("password");

	return new Promise((resolve, reject) => {
		axios.post(
				"user/" + flag,
				qs.stringify({
					flag: flag,
					student_number: num.value,
					password: psw.value,
				})
			).then((response) => {
				console.log(response);
				open_mainpage();
				resolve("done");
				//缓存学号，用cookie
				id = num.value;
				console.log("id: ",id)
				document.cookie = "id=" + id;
				console.log("cookie: ",document.cookie)
				init();
				location.reload();
			}).catch((error) => {
				alert(error);
				reject(error);
			});
	});
}

//修改密码【注意】：这里很不确定写对了没有qwq
function change_password() {
	let old_psw = document.getElementById("old_password");
	let new_psw = document.getElementById("new_password");
	return new Promise((resolve, reject) => {
		axios.post("user/changePassword",
				qs.stringify({
					student_number: id,
					student_number: old_psw.value,
					newPassword: new_psw.value,
				})
			).then((response) => {
				console.log(response);
				alert("修改成功！");
				resolve("done");
			}).catch((error) => {
				alert(error);
				reject(error);
			});
	});
}

function queryPostWithKeyword(){
	return new Promise((resolve, reject) => {
		axios.post("treehole/queryPostWithKeyword", { 
			student_number: id ,startIndex:search_start_index,postNum:search_post_num,keyword:search_keyword,
		}).then((response) => {
				let post_list = response.data.postList;
				let post_items = document.getElementById("post_items");
				console.log(post_list)
				for(let i=0;i<post_list.length;++i){
					let content = document.createElement("div");
					content.setAttribute("class","item");
	
					let post_id = document.createElement("span");
					post_id.setAttribute("class","post_id");
					post_id.innerHTML = "#" + post_list[i].postId;
					content.appendChild(post_id)
	
					let is_favour = document.createElement("span");
					is_favour.setAttribute("class","isfavored");
					if(post_list[i].isFavour == "true"){
						is_favour.innerHTML = "已收藏"//收藏的图标
					}else{
						is_favour.innerHTML = "未收藏"//未收藏的图标
					}
					content.appendChild(is_favour)
	
					let post_time = document.createElement("span");
					post_time.setAttribute("class","post_time");
					post_time.innerHTML = formatUnixTime(post_list[i].sendTime);
					content.appendChild(post_time)
	
					let sub_content = document.createElement("div");
					sub_content.setAttribute("class","sub_content");
	
					let sub_img = document.createElement("img");
					sub_img.setAttribute("class","host_head_icon");
					axios.post("user/queryStudentInfo", { student_number: post_list[i].senderId })
					.then((response) => {
						sub_img.src = response.data.avatarURL;
					}).catch((error) => {
						console.error(error);
					});
					sub_content.appendChild(sub_img);

					let post_content = document.createElement("span");
					post_content.setAttribute("class","host_element");
					post_content.innerHTML = post_list[i].content;
					sub_content.appendChild(post_content);
	
					let comment_list = document.createElement("ul");
					comment_list.setAttribute("class","comment_element");
					for(let j=0;j<post_list[i].CommentList.length;++j){
						let comment = document.createElement("li");
						comment.setAttribute("class","comment_preview");
						comment.innerHTML = post_list[i].CommentList[j].content;
						comment_list.appendChild(comment);
					}
					sub_content.appendChild(comment_list);
					content.appendChild(sub_content);
					content.onclick = function(){
						open_post(post_list[i].postId);
					}
					post_items.appendChild(content);
				}
				search_start_index += post_list.length;
				resolve("done");
			}).catch((error) => {
				console.error(error);
				reject(error);
			});
	});
}

//导航栏的搜索，发洞，收藏，待办，账户按钮
//搜索（不确定）
function search() {
	search_keyword = document.getElementById("search").value;
	if(search_keyword == "") {
		alert("搜索内容不能为空！");
		return;
	}
	search_start_index = 1;
	is_searching = 1;
	is_favour = 0;
	close_sidebar();
	let post_items = document.getElementById("post_items");
	document.body.removeEventListener("scroll",scroll_bottom());
	while (post_items.firstChild) { // 不断遍历子节点列表直到为空
		post_items.removeChild(post_items.firstChild); // 删除第一个子节点
	}                 
	queryPostWithKeyword();
	document.body.scrollTop = 0;
	document.body.addEventListener("scroll", scroll_bottom);
}

function query_more(){
	if(is_searching == 1){
		queryPostWithKeyword();
	}else if(is_favour == 1){
		queryFavourPost();
	}else{
		queryPost();
	}
}                                            

//调出发洞页面
function call_post_page() {
	close_sidebar();
	open_sidebar();
	document.getElementById("sidebar_title").style.display = "inline";
	document.getElementById("edit_post").style.display = "block";
	document.getElementById("sidebar_title").innerHTML = "编辑树洞";
}

function queryFavourPost(){
	return new Promise((resolve, reject) => {
		axios.post("treehole/queryFavoritePost", { 
			student_number: id ,startIndex:favour_start_index,postNum:favour_post_num,
		}).then((response) => {
				let post_list = response.data.postList;
				let post_items = document.getElementById("post_items");
				console.log(post_list)
				for(let i=0;i<post_list.length;++i){
					let content = document.createElement("div");
					content.setAttribute("class","item");
	
					let post_id = document.createElement("span");
					post_id.setAttribute("class","post_id");
					post_id.innerHTML = "#" + post_list[i].postId;
					content.appendChild(post_id)
	
					let is_favour = document.createElement("span");
					is_favour.setAttribute("class","isfavored");
					if(post_list[i].isFavour == "true"){
						is_favour.innerHTML = "已收藏"//收藏的图标
					}else{
						is_favour.innerHTML = "未收藏"//未收藏的图标
					}
					content.appendChild(is_favour)
	
					let post_time = document.createElement("span");
					post_time.setAttribute("class","post_time");
					post_time.innerHTML = formatUnixTime(post_list[i].sendTime);
					content.appendChild(post_time)
	
					let sub_content = document.createElement("div");
					sub_content.setAttribute("class","sub_content");
	
					let sub_img = document.createElement("img");
					sub_img.setAttribute("class","host_head_icon");
					axios.post("user/queryStudentInfo", { student_number: post_list[i].senderId })
					.then((response) => {
						sub_img.src = response.data.avatarURL;
					}).catch((error) => {
						console.error(error);
					});
					sub_content.appendChild(sub_img);

					let post_content = document.createElement("span");
					post_content.setAttribute("class","host_element");
					post_content.innerHTML = post_list[i].content;
					sub_content.appendChild(post_content);
	
					let comment_list = document.createElement("ul");
					comment_list.setAttribute("class","comment_element");
					for(let j=0;j<post_list[i].CommentList.length;++j){
						let comment = document.createElement("li");
						comment.setAttribute("class","comment_preview");
						comment.innerHTML = post_list[i].CommentList[j].content;
						comment_list.appendChild(comment);
					}
					sub_content.appendChild(comment_list);
					content.appendChild(sub_content);
					content.onclick = function(){
						open_post(post_list[i].postId);
					}
					post_items.appendChild(content);
				}
				favour_start_index += post_list.length;
				resolve("done");
			}).catch((error) => {
				console.error(error);
				reject(error);
			});
	});
}

//调出收藏页面
function call_collection_page() {
	close_sidebar();
	//未完待续~~~~~~~~~~~~~~~~~~
	favour_start_index = 1;
	is_searching = 0;
	is_favour = 1;

	let post_items = document.getElementById("post_items");
	document.body.removeEventListener("scroll",scroll_bottom());
	while (post_items.firstChild) { // 不断遍历子节点列表直到为空
		post_items.removeChild(post_items.firstChild); // 删除第一个子节点
	}                 
	queryFavourPost();
	document.body.scrollTop = 0;
	document.body.addEventListener("scroll", scroll_bottom);
}




//调出todolist，兼具刷新之用
function call_todolist_page() {
	close_sidebar();
	open_sidebar();
	document.getElementById("sidebar_title").style.display = "inline";
	document.getElementById("todo_page").style.display = "block";
	document.getElementById("todolist").style.display = "block";
	document.getElementById("sidebar_title").innerHTML = "待办";
	//向后端请求toddolist的内容
	return new Promise((resolve, reject) => {
		axios.post("treehole/todoQueryAll",{student_number:id}).then((response)=>{
			let todoList = response.data.todoList;
			let todo_items = document.getElementById("todolist");
			while (todo_items.firstChild) { // 不断遍历子节点列表直到为空
				todo_items.removeChild(todo_items.firstChild); // 删除第一个子节点
			}
			for(let i=0;i<todoList.length;++i){
				let todo_item = document.createElement("li");
				todo_item.setAttribute("class","todo");
				todo_item.setAttribute("todo-id",todoList[i].ID);
				todo_item.setAttribute("todo-priority",todoList[i].Priority);

				let todo_content = document.createElement("div");
				todo_content.setAttribute("class","todo_content");
				todo_content.innerHTML = todoList[i].Content;
				todo_item.appendChild(todo_content);

				let complete_button = document.createElement("button");
				complete_button.setAttribute("class","todo_complete");
				complete_button.setAttribute("onclick","complete(this)");
				complete_button.innerHTML = "完成";
				todo_item.appendChild(complete_button);

				let top_button = document.createElement("button");
				top_button.setAttribute("class","todo_top");
				top_button.setAttribute("onclick","t_top(this)");
				top_button.innerHTML = "置顶";
				todo_item.appendChild(top_button);		
				
				todo_items.appendChild(todo_item);
			}
			resolve("done");
		}).catch((error) => {
			console.error(error);
			reject(error);
		});
	})

}
//添加待办条目
function todo_submit(){
	let content = document.getElementById("todo_input").value
	return new Promise((resolve, reject) => {
		axios.post("treehole/todoCreate",{
			student_number: id,
			content: content,
			status: "todo",
			priority: 0,
		}).then((response)=>{
			console.log(response);
			call_todolist_page();
			resolve("done");
		}).catch((error) => {
			console.error(error);
			reject(error);
		});
	})
}

function complete(object){
	let node = object.parentNode
	let todo_id = node.getAttribute("todo-id");
	let todo_status = "finish"

	return new Promise((resolve, reject) => {
		axios.post("treehole/todoUpdate",{
			student_number: id,
			todoId: todo_id,
			status: todo_status,
		}).then((response)=>{
			console.log(response);
			call_todolist_page();
			resolve("done");
		}).catch((error) => {
			console.error(error);
			reject(error);
		});
	})
}

//修改待办条目
function t_top(object){
	let node = object.parentNode
	let todo_id = node.getAttribute("todo-id");
	let todo_priority = parseInt(node.parentNode.firstElementChild.getAttribute("todo-priority")) + 1

	return new Promise((resolve, reject) => {
		axios.post("treehole/todoUpdate",{
			student_number: id,
			todoId: todo_id,
			priority: todo_priority,
		}).then((response)=>{
			console.log(response);
			call_todolist_page();
			resolve("done");
		}).catch((error) => {
			console.error(error);
			reject(error);
		});
	})
}




//调出账户设置页面
function call_account_page() {
	close_sidebar();
	open_sidebar();
	document.getElementById("sidebar_title").style.display = "inline";
	document.getElementById("account_info").style.display = "block";
	document.getElementById("sidebar_title").innerHTML = "账户设置";
	//放上学号
	document.getElementById("user_id").innerHTML = "学号：" + id;
	//查询用户信息，返回头像url，背景url
	var avatar = document.getElementById("user_avatar");
	var background = document.getElementById("user_background");
	axios
		.post("user/queryStudentInfo", { student_number: id })
		.then((response) => {
			avatar_url = response.data.avatarURL;
			console.log("Avatar URL:", avatar_url);
			//将avatar的src属性设置为avatarURL
			avatar.src = avatar_url;			
		})
		.catch((error) => {
			console.error(error);
		});
}
//打开某条树洞（未完待续）
function open_post(post_number) {
	//树洞号
	close_sidebar();
	open_sidebar();
	cur_detail_post = post_number;
	document.getElementsByClassName("sidebar_buttons")[0].style.display =
		"inline";
	document.getElementById("details").style.display = "block";

	//向后端请求内容
	axios.post("treehole/querySinglePost", {student_number:id ,postId: post_number})
		.then((response) => {
			let collect = document.getElementById("collect");
			if(response.data.singlePost.isFavour=="true"){
				collect.innerHTML = "已收藏";
			}else{
				collect.innerHTML = "收藏";
			}

			let detailed_content = document.getElementById("detailed_content");
			while (detailed_content.firstChild) { // 不断遍历子节点列表直到为空
				detailed_content.removeChild(detailed_content.firstChild); // 删除第一个子节点
			}
			let comment_list = response.data.singlePost.CommentList;
			
			let detailed_item = document.createElement("li");

			let post_id = document.createElement("span");
			post_id.setAttribute("class","post_id");
			post_id.innerHTML = "#" + response.data.singlePost.postId;
			detailed_item.appendChild(post_id)

			let post_time = document.createElement("span");
			post_time.setAttribute("class","post_time");
			post_time.innerHTML = formatUnixTime(response.data.singlePost.sendTime);
			detailed_item.appendChild(post_time)

			let sub_item = document.createElement("div");

			let sub_img = document.createElement("img");
			sub_img.setAttribute("class","host_head_icon");
			sub_img.src = avatar_url;
			sub_item.appendChild(sub_img);

			let sub_content = document.createElement("span");
			sub_content.setAttribute("class","detailed_text");
			sub_content.innerHTML = response.data.singlePost.content;
			sub_item.appendChild(sub_content);

			detailed_item.appendChild(sub_item);
			detailed_content.appendChild(detailed_item);

			for(let i=0;i<comment_list.length;++i){
				let detailed_item = document.createElement("li");

				let post_id = document.createElement("span");
				post_id.setAttribute("class","post_id");
				post_id.innerHTML = "#" + comment_list[i].commentId;
				detailed_item.appendChild(post_id)
	
				let post_time = document.createElement("span");
				post_time.setAttribute("class","post_time");
				post_time.innerHTML = formatUnixTime(comment_list[i].sendTime);
				detailed_item.appendChild(post_time)
	
				let sub_item = document.createElement("div");

				let sub_img = document.createElement("img");
				sub_img.setAttribute("class","host_head_icon");
				axios.post("user/queryStudentInfo", { student_number: comment_list[i].senderId })
				.then((response) => {
					sub_img.src = response.data.avatarURL;
				}).catch((error) => {
					console.error(error);
				});
				sub_item.appendChild(sub_img);
	
				let sub_content = document.createElement("span");
				sub_content.setAttribute("class","detailed_text");
				sub_content.innerHTML = comment_list[i].content;
				sub_item.appendChild(sub_content);
				detailed_item.onclick = function(){
					switch_reply_status(comment_list[i].commentId);
				}
				detailed_item.appendChild(sub_item);
				detailed_content.appendChild(detailed_item);
			}
		}).catch((error) => {
			console.error(error);
		});
}

//树洞详情页中，刷新逆序收藏（或取消收藏）
function refresh() {
	//刷新就是
















}
function reverse() {
	//反转的代码









}
function collect() {
	let collect = document.getElementById("collect");
	if (collect.innerHTML == "收藏") {
		collect.innerHTML = "已收藏";
		//向后端发东西
		return new Promise((resolve, reject) => {
			axios.post("treehole/favoritePost",
					qs.stringify({
						student_number:id,
						postId:cur_detail_post,
					})
				).then((response) => {
					console.log(response);
					resolve("done");
				}).catch((error) => {
					reject(error);
				});
		});
	} else if (collect.innerHTML == "已收藏") {
		collect.innerHTML = "收藏";
		//向后端发东西
		return new Promise((resolve, reject) => {
			axios.post("treehole/cancelFavoritePost",
					qs.stringify({
						student_number:id,
						postId:cur_detail_post,
					})
				).then((response) => {
					console.log(response);
					resolve("done");
				}).catch((error) => {
					reject(error);
				});
		});
	}
}

//修改背景图片
const background = document.getElementById("bgupload");
background.addEventListener("click", function (event) {
	event.preventDefault(); // 阻止表单提交的默认行为
	const file = document.getElementById("bgimg").files[0];
	const fileReader = new FileReader();
	fileReader.readAsDataURL(file); // 读取文件，并将文件转换为base64格式
	fileReader.onload = function () {
		const dataURL = fileReader.result;
		const image = new Image();
		image.src = dataURL;
		image.onload = function () {
			// 检查文件格式是否为图片
			if (image.width > 0 && image.height > 0) {
				// 如果是图片，则将图片设为背景
				document.body.style.backgroundImage = `url(${dataURL})`;
				//将图片文件上传到后端
				const formData = new FormData();
				formData.append("student_number", id);
				formData.append("background", file);
				axios
					.post("user/uploadBackground", formData)
					.then((response) => {
						console.log(response.data);
					}).catch((error) => {
						console.error(error);
					});
			} else {
				alert("请选择图片文件！");
			}
		};
		document.getElementById("user_background").src = dataURL;
	};
});

//修改头像
const avatar = document.getElementById("avatarupload");
avatar.addEventListener("click", function (event) {
	event.preventDefault(); // 阻止表单提交的默认行为
	const file = document.getElementById("avatar").files[0];
	const fileReader = new FileReader();
	fileReader.readAsDataURL(file); // 读取文件，并将文件转换为base64格式
	fileReader.onload = function () {
		const dataURL = fileReader.result;
		const image = new Image();
		image.src = dataURL;
		image.onload = function () {
			// 检查文件格式是否为图片
			if (image.width > 0 && image.height > 0) {
				// 如果是图片，则将图片直接上传到后端
				const formData = new FormData();
				formData.append("student_number", id);
				formData.append("avatar", file);
				axios
					.post("user/uploadAvatar", formData)
					.then((response) => {
						console.log(response.data);
					}).catch((error) => {
						console.error(error);
					});
			} else {
				alert("请选择图片文件！");
			}
		};
		//更新账户界面
		document.getElementById("user_avatar").style.src = dataURL;
	};
});

//发树洞
function submit_post() {
	let input = document.getElementById("post_input");
	let content = input.value;
	return new Promise((resolve, reject) => {
	axios.post("/treehole/submitPost",
			qs.stringify({
				student_number: id,
				content: content,
				quoteId: -1,
			})
		).then((response) => {
			console.log(response);

			resolve("done");
			location.reload();
		}).catch((error) => {
			alert(error);
			reject(error);
		});
	})
}

let reply_id = -1;
let reply_status = 0;

function switch_reply_status(comment_id){
	if(reply_status == 0){
		reply_id = comment_id;
		reply_status = 1;
	}else{
		if(reply_id == comment_id){
			reply_id = -1;
			reply_status = 0;
		}else{
			reply_id = comment_id;
		}
	}

	if(reply_status==1){
		document.getElementById("reply_item").style.display = "block";
		document.getElementById("reply_item").innerHTML = "RE" + reply_id.toString();
	}else{
		document.getElementById("reply_item").style.display = "none";
	}
}

//发评论
function submit_comment() {
	let input = document.getElementById("comment_input");
	let content = input.value;

	return new Promise((resolve, reject) =>{
	axios.post("treehole/commentPost", { 
			student_number: id,
			postId: cur_detail_post,
			content: content,
			replyId: reply_status==0?-1:reply_id,
		}).then((response) => {
			//open_post(post_number)来刷新
			console.log(response);

			resolve("done");
			open_post(cur_detail_post);
		}).catch((error) => {
			console.error(error);
		});
	})
}
