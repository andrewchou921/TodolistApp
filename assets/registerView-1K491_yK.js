import{u,r as c,c as _,a as s,w as f,b as r,v as l,d as w,e as g,_ as v,f as h,o as C,g as b,h as i}from"./index-CM1uWy1J.js";const k={id:"signUpPage",class:"bg-yellow"},x={class:"container signUpPage vhContainer"},y=s("div",{class:"side"},[s("a",{href:"#"},[s("img",{class:"logoImg",src:"https://raw.githubusercontent.com/hexschool/2022-web-layout-training/main/todolist/logo.png",alt:""})]),s("img",{class:"d-m-n signUpImage",src:v,alt:"workImg"})],-1),V=s("h2",{class:"formControls_txt"},"註冊帳號",-1),U=s("label",{class:"formControls_label",for:"email"},"Email",-1),T=s("label",{class:"formControls_label",for:"name"},"您的暱稱",-1),$=s("label",{class:"formControls_label",for:"password"},"密碼",-1),q=s("label",{class:"formControls_label",for:"passwordConfirm"},"再次輸入密碼",-1),B=s("input",{class:"formControls_btnSubmit",type:"submit",value:"註冊帳號"},null,-1),d="https://todolist-api.hexschool.io",N={__name:"registerView",setup(I){const m=u(),o=c({email:"",password:"",nickname:"",passwordConfirm:""}),p=async()=>{var n,e;if(o.value.password!==o.value.passwordConfirm){console.error("密碼和確認密碼不一致"),alert("密碼和確認密碼不一致");return}try{await i.post(`${d}/users/sign_up`,o.value);const a=await i.post(`${d}/users/sign_in`,{email:o.value.email,password:o.value.password});document.cookie=`customTodoToken=${a.data.token}; path=/; secure; samesite=strict`,alert("註冊成功"),m.push("/login")}catch(a){const t=((e=(n=a.response)==null?void 0:n.data)==null?void 0:e.message)||a.message;alert(`註冊失敗: ${t}`),console.error("註冊失敗:",a.response?a.response.data:a.message)}};return(n,e)=>{const a=h("router-link");return C(),_("div",k,[s("div",x,[y,s("div",null,[s("form",{class:"formControls",onSubmit:f(p,["prevent"])},[V,U,r(s("input",{class:"formControls_input",type:"text",id:"email",name:"email",placeholder:"請輸入 email",required:"","onUpdate:modelValue":e[0]||(e[0]=t=>o.value.email=t)},null,512),[[l,o.value.email]]),T,r(s("input",{class:"formControls_input",type:"text",id:"name",name:"nickname",placeholder:"請輸入您的暱稱","onUpdate:modelValue":e[1]||(e[1]=t=>o.value.nickname=t)},null,512),[[l,o.value.nickname]]),$,r(s("input",{class:"formControls_input",type:"password",id:"password",name:"password",placeholder:"請輸入密碼",required:"","onUpdate:modelValue":e[2]||(e[2]=t=>o.value.password=t)},null,512),[[l,o.value.password]]),q,r(s("input",{class:"formControls_input",type:"password",id:"passwordConfirm",name:"passwordConfirm",placeholder:"請再次輸入密碼",required:"","onUpdate:modelValue":e[3]||(e[3]=t=>o.value.passwordConfirm=t)},null,512),[[l,o.value.passwordConfirm]]),B,w(a,{to:"/login",class:"formControls_btnLink"},{default:g(()=>[b("登入")]),_:1})],32)])])])}}};export{N as default};
