// import React, { useEffect, useRef, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Camera, Utensils, TrendingUp, Users, ChevronRight } from 'lucide-react';
// import DynamicGradientText from '../../components/DynamicGradient';
// import TypewriterText from '../../components/TypeWriter';
// import { Link } from "react-router-dom";
// import { useAuth } from "../../context/AuthContext";


// const LandingPage = () => {
//   const navigate = useNavigate();
//   const canvasRef = useRef(null);
//     const { owner, loading } = useAuth(); // ✅ FIX

    
     
// // const handleGetStarted = () => {
// //     if (loading) return;

// //     if (owner?.username) {
// //       navigate(`/${owner.username}/dashboard`);
// //     } else {
// //       navigate("/register");
// //     }
// //   };
 


//   useEffect(() => {
//     const canvas = canvasRef.current;
//     if (!canvas) return;

//     const ctx = canvas.getContext('2d');
//     const img = new Image();
//     img.crossOrigin = 'anonymous';
//     img.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80';

//     let animationId;
//     let rotation = 0;
//     let scale = 1;
//     let scaleDirection = 1;
//     let floatY = 0;
//     let floatDirection = 1;

//     const animate = () => {
//       const width = canvas.width;
//       const height = canvas.height;

//       // Clear with subtle gradient
//       const gradient = ctx.createRadialGradient(width / 2, height / 2, 0, width / 2, height / 2, width / 2);
//       gradient.addColorStop(0, 'rgba(17, 24, 39, 1)');
//       gradient.addColorStop(1, 'rgba(31, 41, 55, 1)');
//       ctx.fillStyle = gradient;
//       ctx.fillRect(0, 0, width, height);

//       ctx.save();

//       // Move to center with floating effect
//       floatY += 0.3 * floatDirection;
//       if (floatY > 15 || floatY < -15) floatDirection *= -1;
//       ctx.translate(width / 2, height / 2 + floatY);

//       // Smooth slow rotation
//       rotation += 0.003;
//       ctx.rotate(rotation);

//       // Smooth breathing scale effect
//       scale += 0.0003 * scaleDirection;
//       if (scale > 1.03 || scale < 0.97) scaleDirection *= -1;
//       ctx.scale(scale, scale);

//       // Add glow effect
//       ctx.shadowBlur = 40;
//       ctx.shadowColor = 'rgba(6, 182, 212, 0.4)';

//       // Draw image
//       const imgSize = Math.min(width, height) * 0.85;
//       if (img.complete) {
//         // Create circular clip
//         ctx.beginPath();
//         ctx.arc(0, 0, imgSize / 2, 0, Math.PI * 2);
//         ctx.clip();
//         ctx.drawImage(img, -imgSize / 2, -imgSize / 2, imgSize, imgSize);
//       }

//       ctx.restore();

//       // Add sparkle particles
//       ctx.fillStyle = 'rgba(6, 182, 212, 0.6)';
//       for (let i = 0; i < 3; i++) {
//         const angle = rotation + (i * Math.PI * 2) / 3;
//         const distance = (width / 2) * 0.7;
//         const x = width / 2 + Math.cos(angle) * distance;
//         const y = height / 2 + Math.sin(angle) * distance + floatY;
//         const size = 2 + Math.sin(rotation * 2 + i) * 1;
        
//         ctx.beginPath();
//         ctx.arc(x, y, size, 0, Math.PI * 2);
//         ctx.fill();
//       }

//       animationId = requestAnimationFrame(animate);
//     };

//     const handleResize = () => {
//       canvas.width = canvas.offsetWidth;
//       canvas.height = canvas.offsetHeight;
//     };

//     img.onload = () => {
//       handleResize();
//       animate();
//     };

//     window.addEventListener('resize', handleResize);

//     return () => {
//       cancelAnimationFrame(animationId);
//       window.removeEventListener('resize', handleResize);
//     };
//   }, []);

//   const features = [
//   {
//     title: "Menu Visualization",
//     description:
//       "Let customers see dishes in 3D before ordering with immersive augmented reality previews.",
//     icon: Camera,
//     image:
//       "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTmpc_igRYqatIrc5KMJ7fOprCk5qNcARxs3g&s",
//   },
// {
//   title: "AR Menu Insights",
//   description:
//     "Understand which dishes customers explore the most in AR and optimize your menu accordingly.",
//   icon: TrendingUp,
//   image:
//     "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
// }

// ,
// {
//   title: "Live Ordering Management",
//   description:
//     "Track and manage live orders in real time with seamless kitchen and front-desk coordination.",
//   icon: Utensils,
//   image: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxAREBUQEBIQEA8VEA8VEA8PEhUQFhAWFhUWFxURFRYYHSogGBolHRcVITEhJykrLi4uFx8zODMtNygtLisBCgoKDg0OFxAQGi0lHR0tLS0tLS0tKy0tLSsxLS0tLS0tLS0uLS0tLS0tLS0rKy0tLS0tLS0tLS0tLS0tLS0tK//AABEIALQBGAMBEQACEQEDEQH/xAAcAAEAAgMBAQEAAAAAAAAAAAAAAQMCBAUGBwj/xABREAABAwIDAgcLBQsKBwAAAAABAAIDBBEFEiExQQYHEyJRYXEUMkJScoGRobHB0TNTkpPSFSVDRGJ0gqLC4fAWIyRzg5Sys7TxNFRjZGV1pP/EABsBAQEBAQEBAQEAAAAAAAAAAAABAgMEBQYH/8QAOREAAgIBAQQHBgUDBAMAAAAAAAECEQMSBBMhMQUUQVFxkdEyUmGBofAVIlOxwUKS4UNiovEjM3L/2gAMAwEAAhEDEQA/APhqAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgJsgIQBAEAQBAZMjcdgJ7BdCNpB8bmmzgQegiyBNPkYoUIAgCAIAgCAIAgCAIAgCAIAgCAIAgCA36Cia4Znl1r2Aba5ttJJ2DzFQ0o95s9wQ9Ev1jfsIrLSIFDD0SfWN+wtUTgSKSHxXeeT4NSl3kJFPD4gPa53uIVpGbJFPH8230yfaWlFEsybSx/NNPnk9zlpY77CWzNtM3dC36Lne0lbWF+6/Jk/MZCF26Jv1DT+ytrBP3H5MzUvj9TIU7/mR/d2fZWur5fcf9v+Bol8fqZtgl3Qt/u0ftyLXVc3uPyJu5fHzZcxlUO9a8eSwN9gW1sm0e4/Ij2e+aMgyt3cv9Ij3q9T2n3GTqq9wybBX7jUD+1I/aV6ntXuv7+ZOrR9xeSJNHXna6Y9s1/wBpXqW1e6/Neo6tH3F5I1ayKXJLFOSS2EyMzOzlhDhq030uLgj4BefNhnC45OdWc5Q3U4OKq3T+Kd/a/wAnmF4T3BAEAQBAEAQBAEAQBAEAQBAEAQBAEAQHq+CMTXOYHAOFpdHC43L6HReOM9pUZK1T5nRcj2MeHwnwIm9ZYPcF+oezYY8sa8kQtdh8AGhivlvYRnU+LsUjCP6a+hTu8GcCw2aIvqqhsMgeQI88UXNsLO57STfXZ0LxbZlz4pqOHEmq56W+PyDvsR2hwcwIfjbf7xF7mry9a6Q/S/4sXLuMjgmAD8ZB/tx7gnWekv0/+IuXcQ3C+D4Gs4vvHLv9wV6x0p7n0Rbma+IUeAiM8jI10umUOlntt12dV1qOXpRviuHhE4bVLalie4S1dlni8U5ESHkDzLDYXEX35c2ttm3ffdZfY2Z5XjW99r77uB12R53hj1itfbRrsLLc7NmzN0FrZfC1vtXV6r4d31PSTI+LnWz3uMlyNBvv6/UolPhfzFMsbPBmJyvLczC0ZrHKCM4JvtIusactLir4/wCCUy6sradz80cQjbZvMLnOAI2kc4WB001XPBizxglklb7/ALRFF1xKBWN8SPtu/wC0uu7fe/p6DQVGbsW9I0nm8cf/ADkx/wC1t+u1fmuleGeX/wAo+dta/wDJDxX7M8eviHcIAgCAIAgCAIAgCAIAgCAIAgCAlAEAshaPpfEvh8VRXRRTNzxmGqOW5GoLLG4PWt4c08U9cHTN/wBJ91fwNoR3tO13lSyD3lez8T2r3/ovQxZMXA+h8KljHZJI722U/Etq99/T0FslnBChub0sIG4hzyT5jsU/Etq99jUyDwTpBspKY6nvi7zblPxDaf1GXUy2TgrReDSUx6czbe5Tr+0/qPzGp95MXBij8Kkpeq0YPtCnXtp/Ul5san3kfybpt1JR/VD4Kdd2j9SXmxqfebI4P0Q/Fab6lnwU63n9+Xmyan3mf3DpP+WpvqWfBZ6zm99+bGpmLMGgB+Qpbb7QtCzv8/bN+b9SuXiWDC4r/JU9v6pt1N9lv2n5v1F8Dm43hEjizudsbGgOzgBrLnS25dIZeeps+R0lh2zI4dXlSV3xrw7Gc77hVvjNHR/ObPQ1dN9E+Z1HpR/6j/v/AMHpqCkyxMbIGl4a0OdYG5tqb2XnlJtuj9Fs0ckMUI5Hcklb+J+fOOw2xSptoBRUw063M+K3F/kf32omX24eP8M+VLidwgCAIAgCAIAgCAIAgCAlAEKEFEoWhZQULIWhZBR9V4hh98ovzes9rFFzZX7J+hasgAXa92uxhsR1nUaLRzNMtadeQnN73s8aXvcW5S3+6AyZAwmxhlHWX3A/XugNxj7CwY4AAADT4oCRKfFcOvT4oCxAEAQBAUvqGg5bPvpsY4jXrAtvQGTpgDbX6Lj6wEBmgKKqsZHG6R9wxgJcSLWA2nXd1oD5dXcZtbM5zqGKljpw9zWPqhJK+W2heGMLQwXuNp2L6ey9GZM8dV0jClZ8y4dz1dTO6pmbHI+aNkb+5o5GtYIy0t0LnEE5dt+la2jo7LgSS/Mn3JmZQbafd/1/J5I4e/5mX6LvgvH1bJ7kvJ+hr8x1aPgsZGB7nsiuL5ZA+416gvfj6HyTgpXV9lcvE6xxSauzlYxhjqd+Uua8bnsuWuHSLgH0heDadlybPJRmuZJRcXTOevMQIAgCAIAgJQCyFomyFoWULRNkFCyFoWQULIKJshaFlBR9V4hx98YvzWs/xsUj7TEvZP0NUd7fIX28EAEnsuQFs5CA80WaWfkkAEejRAWIDkY/iUkGTJl52a+YE7LdB618rpPbMmzaN3XG+f8A2j3bFs0M2rV2HJbwlm/6W0i2V230r5H41tXdHyfqex9H4rrj5r0L48bqDsbGexp+0useldrlyUfJ+piWxYFzb+/kZDHJuhn0XfFT8Y2nuj5P1J1HF3vzXoZfdyUaHkx5j8VfxfafdXk/Uz1PF3v6egOOS7QIz5j8Vr8X2jtS8n6hbFjfa/p6GL8dnHgxeh32l1/E9o7o/X1Ktiwvtf09Co8IJ+iD1/aWl0nn/wBv38zf4fh/3ffyKjwlqL2yw+h1vTmWl0lnuqj9fU6Lo3BV3L6ehyuEfCOaSjqInMjyyU1Qx2UOa6zo3A5SSQDY7bFbj0hlbSaXHx9TT6MwqLab4eHoeL4DYBVT0UckMbCy8gaZXNF7PdsvtX7zZtuwY8EIzk7+Hiz86lR25eBte78HANb6PYL9uq9EelNlX9T+p1TIdwNxE3Aip9ZA/SRuh8Ua971KLpPZV/U+VcjakiuLghiLXte1lNds7XtvIyxeCCG9nUpLpLZJRcXKXFVyZtTieB42MIq4XRy1TGgva1okjILHlrGN3aZrR3PWetfK27JglhxxxSb03z59jOc2qjT5HztfLMBAEAQBAEBnZQ3QshaJslloWUstE2QULIWibIWhZBQsoKFkFH1fiIH3xi/M6z/NYsw9pmZ+yfoCqcA03cWDTnNsSNesH2LqcSqGPNZzZpHNv0Ms6x2HmoDbQHB4SUsknJ8m1z7ZrkW32svi9L7Ply6N3G6v+D6PR+WGPVqdXR5t3B6c35s1i4OLQ1vTfbt86+Qtk2mKrdv7+Z9PrmLh+ZHQjpJh+Cl/WUjs+0RVbuX1OMsuJv219C0U8vzcvod8Frc51/py+voc9eP3l9CJaNzrXiebeMxzvcsuG0L2YTXyl6EU8fbJfQwdSPAsI3gW0GRwt6ll4c7duMuPwZ0jkx9680bxdD81NsHgP+2vrqWz1/65+T9TzKOX34+a9Dj1kJLyWRyNZfmgtdoF4cuNubcItLs4M+hhmlFKUlfijTdG8eC+3klIxmuafkehSg+1GnXscY3iz9WPGw66EWPQusbvtK6a7Dn8B+FjqTC4YmxNkInrmkvcdMsxdpYfl+pfuuj+j47TDU5d3L5+h+SladHci4wpnG3I07et73Admxe2XQ2OKvVJ+CROJb/Lua/e0fbyj/gsfhWP/f5IcTXm4wpmmwipnb7sLyL/ABXSPQ2KSvVJeNDieL43sadW4bDK5jY3R1zo7MvYh0JcDrs2H0L5m37GtmmoxdpqwfGl4ChAEAQBAEBbZZO9E2ULRNkLpFkLRNkLpFlC0TlQaRZLFCyWXSLJY0n1fiKH3wi/Mqz/ADmKQ9qX32HHLyP0BLe3NIB01cLj2rqcBDmtzi0u3losPQSUBmgKaiXI3N0bVmUlGLlLkixVuimqmIcLPDRluQWZt+291ohDBMQCJGWOoJivp9NAWOZNufHu2xnz+EgMKvl80fJ5Mucctm8S2uXrUd9h1x7upa7uuFd/xL5Jw0gFXss5JGu6ofchrotugOa/Ybb0BkJJri7Y7aXsX+rmoDbQGMjbgjpBHpRg/O2EuIo7Ha2vrgd3fNgf71+h6Ad4Pkv5Oko/nl4nQoql73tjvcue0ZnOfpc23HZqvrZoQhCU65J8q9BpPVNwEk5RJdw3kPtqNnf/AMWX5f8AHoXwx8PFehEm5OPceTrah7HuYTYtcRmDnA6EjpX6jZ4wyY45EvaSfZ2rwNaDl8KW58Hk/Ir6Z30oKhq+N04vzY38Gc8iqj5avgkCAIAgCAIDayrlZ7tBOVLLoGRLNaCciljQTkSy6Ccill0k8mljQOTTUXSOTTUNJPJKahpPqfEa22IxfmFX/qGq4ucvvsR5M6o+91LbttkEmzmutY+ldzzFdJEBf+abF5OXW+3YgNkoDHKCLEadBQGJb0A2A3Gw7LIDi4jXuhkyiKd7crXZg95FyTze9PtXSMLXM+VtfSE8GTQsTkqu1flyf7mxgdcZS4FkrMob8qb3vfZcBScaOuxba9pcrg41XPts6ywfQMHRNJuQCRsuo1ZbKZYWm9wNvitNid+o2qkOU/Ho2PLXSPOV5a60QOoOouCuixto+TPpjZ4TlB3cXT4dqOnh2IxzgmO9mmxzAtsdu9ZlFx5ns2XbMW0xcsfY64qjbWT1H59pKKV0VQAxxDMVnBc1rnAXgjIvlBt3o9IX2egc0I46bXLlw7/8no/rlZlTUs0cjH8lK4BzSckMuliDvaF97JkhkxyjaVpri16m0ke1gxCON3KRxVkhLiS19PKNHOBNubtA2DYvxP4NnvjKH9yM1x5nj8Rw+pmnkeymqQ1z3FuaCUaE6Xs3av2Wy5MeHBCEpxbSS4Nepvh3mrjuGzx4TV8rFIxvLYeWl7HMzHPI0gZgL2zj0r5XTObHkWPS03x7U+7uOGeqVHyKy+Cc6FkJRCAIAgCA7go14d6fa0GQolN6NBkKJN6XQZCiU3g0EiiU3hdBkKJN4NBPcKm8GgnuJN4NA7iTWNBPcKusaT6HxMx5cUjH/jao/wD0hejZ3erx/hHz9rVM+6TRhwsc36Li0+kEFek8ZVHAAQRyunTIXDzgnVAbCAxkkDRc9SFSsqkmfcZQxzSAbl7gfQGkH0oQw5eX5tnmkPvaEBtA3QGtV1ZY+NuR787iC5ouGad87oCjZ1x49UZO0tK8/A2C4DzqnIpdVi9skm/UMJB8+xAVsihkcbxDMCbl8JF+xxFj5irbOL2fFJ24ryRfBTsZcMa1gJuQ0Bt+vRG7NY8UMfCEUr7lRaodD59xcOIlxNjc124iDZuW+sLB4Xkrjsq/Jx75fuzpm9v5L9j3LHvG1rndZLPcvRS7zmZiR1jzddLDMNVGl2AZ3eKOrnfuUB4vjgjc/B6gEAAOpnaOudJ4yd3aquZmT4M/MHc5TSehpGJgKuklIxMJTSSkQYSmklIgxFNIox5MppJR7kUi+NZ96jMUqgokUqoMhSoCe5UBPcyAdzKgnudARyCEI5FUHseKZtsXZ/6uf/VBevZeUvH+EfN2z2vI+3Feo8RTSnb5vDz/AOyAvQGEkYcLHYo0nzKnRU+nZva02bbVodoN11UQ51Xi7YnZHSagNOkLnCx2d6VtQbVo8G0dJYME9E2758m/2N3DsQjmByOzFts3Mczbs0cpKLjzOuzbZi2hPdu658Gv3NxZPUUTwF2x2XZqOpZkm1SdFToqfTHWxffUizmnzat0WiA1G7k9egOj0/WVoxrjdWWCoNr8nJ+ofNo5KNWWxyX3OHlCyhTwXF+xv3QxZhsf6XG+xF7XMo9gXHBai/F/udMvtfJfsek4TV5pqR88EUcsjXRhsZ0Di6RrDqO1enFob/O6XeefLKUI2lxPNcFOGNVU1bIJ6aCKN3KDOw5iHNaXW749BXWawabxzt8+T5eRxx5skpVKNHumOY64AGh6PWOleVSTPW4tHmeMgMfhFXly6Q5tLaZXNcfYtQabRmaaTR+bnUq9GkuswNMmkazA0yukmsxNMmkazA0yaSazE03Umkaz6CKNfm9R+loyFIrZKJ7kVslDuZVMDuZUhHc60iEGBaolkGBWiWYGFNIsrdElCzf4PYy+gq21bImz/wBEfDybpDFbNMX5r5XeLstvW8WVQu/vgjy58TyM9k3jc8ehePIna72tC9CzxZ5XssjOHjfph39JWdreQP7YW1lizLwSN2Pjdw498yrZ2xA/4XFaUkYeKRsR8a+EHbLMzyqab3NKtmdDL28Z2EE27p005xje0a9oVJTMncN8El1fUUzjYfKAX7NR6lpNrkcMmzYsjucE/FJnUoMZwwC8NRRNzWuI5Ym36LgFRtvmXFgxYr3cUr7lR0462J3eyRu8l7T7CodS8G+zVAYXad426670ByKvg1DI9zy54c5xcbZDqei7b+tdVlaVHx8/QmDNOU23cnfZ/KNvCMLbThwaXODnA84AW0tuCzOeo9Ww7DDZIyjBt2741/B0Fg9x874F6Y1izQASe5DYm3hT39q5wXtL4/wjc+zwPW47hPdVNJTn+bDw3nsdcgtcHAjTqXfFLdSUkcckd5FxZwcA4AilqWVJqZ5nx8plZI4OaS9jmG+lx3y9GTa3OLjpSs4Y9lUJKVvgevY1w8Fg7CfgvIeo4XD6N7sKrW2brRVO8/NuPQhD4B3JfXpX0tB4Vm4GJoupXdk3xBoepXQTfGJoT0JuxvzA0PUm7Jv0YGhPQm7G+PqDsMsvwCzH7mip1AF0WUlFTqULopslFLoAuqkZaKnRhdUzLRU5oXRMyytwC2jLDIS7vWk9i3aMMyfShvyj2M6ibn0BXUjGo1ppoG7GukO7NzQsuSFs158QOUZYYDbpYTbfussxSb4kk32M58uKDY6CEjxmGRmvaHELusS7Dg8kil1ZATbkHdALZzYnf4J0XRYvv7ZjelYkpnG2Soad2WRj7+lgstaGZ3hgRTHY6o87Izfr74LSg/v/AKJrRh3PAdk7h1OgPp5ritaWYckYGjjOydh7Y5R7Gla0mXIrdhgP4WmPa8j2tWqM2jD7ina3kHG1+bLHe3TqQtUzNotZh1U3vBIOjk5R6RlclMzaMste3Y6sGt9HynXp0KtMlotixnEoyC2etYRa13yaW7Ur4Ev4m6zh/jDfx2f9JkTv8TE0otsudxlYucuaqzZXBwvFE3UbjlaLjqTRFlhlnC6riq4o9rxV4hNVYhUTyuby09BA9xjszVk72bBexsBp19a4JJSl4/wdJcYx8P5PqrKZ3hOf5nn4BasxRmKUeNJ9Y74pYovKhTk49Rg0lQ0E3dTVA+lG4bFpybB8Tw+lD4o3dMcZ9LQvtQjcUz8xkzuMmu4224cF00HF7UWDCh0K7s5PazL7j9Su7MPbQcE6k3ZOvGJwPqTdjrx6GSsC/mUcLP65ZqyVQXaOIjZqyVK7RxGdRrvnXZYzLkZspJXbGkDpdzVtRMOaNqLB/Hd5mj3laObyG5FhsTfBBPS7VUw5MsmoWuFjmA/JcWq2zNI57uDcJ3yfS9exKLZQ7gvHue/sOtldKJZry8GNNJAf0PeSVpIlnLqeC8muV7CNdDmB9IC7xOMjmS8HKgXA5M9jiN/XZd1ZxkjSfgtSNsdx1OYd/b8F0o5Mpdh042xSbrFrSba9StGbKHU7xtY8dF2Efxp2q0ZsrDbmw226L3OzX+ArRLDtNNQbWO319PYEoli1uy20777PJ/crRLIAtb3bx+T8epWiajJpc0CxIsfBOjfONpVozZYyrkaNJJAL6DO7XrOuxUnaWtxGbUCSQ7/GPmGtgrxMNI26OoqJDpbZZznMZlb+rcnqWkmzEmke64qLsxYtOuegmu7LkBLJYdgGnhLzZVU2erE7gvmfX6mYtLbAnbs953Li5qLSa5/ThfE6pXZayxGbpAWrshVVSFuWwJ1Ps39Sy5U0qu3Xh8SpXZE9nQuJ0vE69912laTsj4HwLAKq1LD/AFEI9DAvv4K3cfBH43bE99Pxf7nXjrAu6PDJM2o6wLSOEkzajrGqnCSZsMqmqaTi0ywVDepTSzH5jzLqpfgliP7trKnVK6LGZcyt062sZhzNabGKyL5COJw/KIufV71YYm3xMzlGuF38jXbw0xFvf0THDpa/9679Xj3nkeXIv6S5nGNI35ShmHkkn2hR7L8SdYfajZi4zqT8JDUR9rQVnqsu8daj3G9BxjYY7bJIzyoz7lNxI11iJ0IeGeGv2VUQ8q7faFVhl3DfR7zowYrRyd7UwO/tG+8raxMm9j3l7pYT3ssTvJe0+wqvFQWVM1ZoujXsVSorZpSxLtE4yNV8S6o4SRS6NbRyZWWrZzZBZfb61TLZgaZlrFjD2tBVozZS+giIsY226Bp7EpE1NGvJg1OfAt2OcB6LppRNTRU/AYCLWeAN2b4hNKJrZS7g9HY2c4E7zY27FdCJrZjFwfaDq/M3xcoF/PtRQDyFGL4vFTWYLOf4MbBs8w/jtVbSdMxBOfs8u98ijDuFFXFUR1keVssdwyINuzI4WfG/UEg2G8agHctZseuJMElilSdp87PVu45sQI/4Onv0kuPq/evKtnkex7RExZxzYkPxalPQDn09DleqyJ1mJqu42sZdsbSDovCTbz51rqkjL2uCKarh5i1VG6GeaOOF7S14p4xG5zTtbm1LQRppqusNi4/mPPl29JfkNeGrAAGwAAADcOhe9Qo+TLJfYbLK0da1Ryck+wuZXtWqZyaj3FzcQCvE5uECwYgFbZzeKBmMQHSrqZl4IHKMy/I6D+pORBlWlEy5GJlWlEy5EGRaUTLkRnWtJlyMS9aSMuRi6x2gLVGWyiSlid30bD2tBWuJzaj3Gu/CKY/gmeYW9itGWkaz+DtMfBI7HFNK7jOlGH8n4h3j5meS9XSjNfEluFSt7yqnb2nN700InEsb90W95WOPU4Ju/iNTLBi+LN8OF/a0a+xTdy+AczIcJ8Rb31PE/wAnT2FXTPuM6kZt4ZzD5SkcPJJPuV/MuwzwfaWN4dReHBMz0FNfwZNPxL2cNaM7TI3tYT7Fd7EzupG0zhPRO/DNHlAhaWSPeZeOXcbMeLUzu9mjP6QWlJd5hxfcXtmjOx7D2OC0mYaMZ6qJgLnvY1oFyS4K8O0wzyOJ8JZJiY6QFkewzuGp8kblIuU/Y5d/oV41Hjl/tX8/fmaNJh4bzjdzzte7UldoY4w5czE8sp8OS7jeDQtnOzINQlmQaEMszFlpGGjIELVmHFGQcFdRlwRIerqMPGZCRXUZeMyEquow8ZPLK6ibsnl01E3Zlyi/OJH75yHKKpGbGdaozZGdWiWM6tGbIzrVGbGdaozZGdCWM6pmyMytGWxmVJZGZUhGZUyQXKkZF1TJF1SMxICpllT4GHa1p7QEIa78NhP4NnmFlNEX2DU+8ofgsB8G3YSpuoPsLvJLtKjgUfgukb2FTcQG9kBgbL3c57upxVjhgviZeafZRvxQBosF6NR5nHjbM7JZNIVsmklLJQurZlxF0JpGZWyaRmVsy4jOlk0jOrZNI5RWzOknlEsmkjlVbJpL86+JR+vsZ1TNk50oljOtUZsjOrRLGdUgzqmWxmQhGdaIxnQgzKkIzKmRmVIMyEIzKkIzKkZGZCDMqZIzKgXQhF1SURdUyLoSiLoSiMypKGZWyULpZKIurZKIzJZmhmVslDMlkojMrZNIzJZNJGZWyaSMyWTSbGdfKP0ljOqSxmQgzKksZlogzoQZ0IMypCMypBnVIMypBmQgzKkIzIQZlSEZkIxmVIRmQDMqZIzIQZlQRmQgzK2ShmVIRmQEXQlDMhKIzKkoZkslEZksUMytkojMlkoi6tihmQlEZkJRfdfOPuWLoQXVAutEF0ILoRi6IgJVILqkF1ohF0ILoQXVILoCLqkF0AuqZIJQC6EF1SEXQguqBdCEXVAuhCLqgXQhF0ILoCLoQi6ChdUhF1CC6oF1Qf/Z"

// ,
// }
// ,
//   {
//     title: "Customer Feedback",
//     description:
//       "Collect real-time feedback and ratings from customers to continuously improve service quality.",
//     icon: Users,
//     image:
//       "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxITEBUSExMWFRMXGBgVGBYVFRoXFRUVFxMWGBgWFRUYHSggGBslHRUXITEhJSkrLi4uFx8zODMtNygtLisBCgoKDg0OGxAQGy0lICYtLS0vLS0tLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLf/AABEIAOEA4QMBEQACEQEDEQH/xAAcAAEAAQUBAQAAAAAAAAAAAAAABgIDBAUHAQj/xABMEAABAgMCBwsIBwYFBQAAAAABAAIDBBESIQUxQVFxkdEGBxMVUlRhgZOhwRQXIjKSo7HTI0JicoKywjOi4eLw8RYkNGOzQ1NzdNL/xAAaAQEAAwEBAQAAAAAAAAAAAAAAAQQFAwIG/8QANxEAAgEDAQQGCgICAgMAAAAAAAECAwQREhMhMVEFMkFhcYEUIiMzkaGxwdHhQvAG8VJTFRY0/9oADAMBAAIRAxEAPwDta8noIAgCAIClxRkooXkkIAgCAIAgCAIAgCAIAgCAIAgPQUBUHKckYKlJAQBAEAQBAEAQBAEAQFD1DJRSoJCAIAgCAIAgCAIAgCAFAYvGEPldx2L3s5HD0mlz+o4wh8ruOxNnIek0uf1KmTsMkAG89B2I4SW8lXFOTwmZC8HYICppUpkFakgIAgCAIAgCAIDxzgBU3BG0t7JSzuRi+XNrjp00XD0iGeJ22Ey5by4wvec70c8Y3FS9EBAEAQBAEAQBAWYNqptYsmLPl6VzhqzvOk9ONxeXQ5hAeOxFSiHwI2BXErZiJGQ+TeGh1k31uoaimdRqR0dKSWcFMn+0bpCifVZNH3iN+qprhAEBW0qUQypSQEAQBAEAQBAYOEGPcQACRj61VuFOTwluLNBwjvbMPyZ/JKr7KfIs7WHMyZJrwSCKDpzrvRU4vDW44V3CW9My2hWSseoAgLE1NBlKgmtcXR/deowcjjVrKnjJj8at5Lu7avWyZx9MjyY41byXd21Nkx6ZHkzJlZgPFQCL6XrzKOk70qqqLKLy8nUIAgCA8diKIh8CNg5sauGIng2czhS0wsAIuAtZ89RkXhQ35LU7jMcGFJ/tG6Qpn1WcqHvEb9VTXCAIAgKrSnIwLSZGDyqgCqAuL0eQgCAIChxUM9IpUAIAgCA1uGfqdfgu1LtKN7/Hz+xhQoBNCbm4yajFXIO5dclSMG974CND+s2lm7Ea0JGI5cdUTEo9q4GxwR6h+94BcKvEvWfUfiZy5lsIAgCAEIDX8VN5R7l12zKfoceY4qbyj3JtmPQ48yuFg1rXB1o3GuRQ6raweoWsYyTyZq5loIAgCAIAgCAIC6vR5CA8qhJSXKMgpUEhAafdPukgSMNsWPbsudZBY2t9K33hQ3g6U6bnnBx7CO+tNGdMaFdAbcyC71S2lKvpjJx9GRecPiWVGmlpxnv7fI6Rvd7svLoTuFdCbHtGkJho6xQX0cSTfW8dCmL7Gca1NJKUeH3N/hn6nX4KxS7TKvf4+f2MRsVtmhtVpZupkdaXXDKynHThlDnts0bW8gkmmSt12lMHltYwjZYH9Q/e8AuNXiXrPqPxM5ci2EAQBAEAQEN3Vb4kvJxDBDTFij1g02WtOYuob9AXpQyeHNI0MrvwsLgIkqWtylsSpHUWgHWF62ZG0JvBw8yKxsSCWvhuAIN/WCMhBuovUaeVvK9W5cJYSLjsJvFxaO9TslzObvJLsHGb6VsinXt6U2S5j0yXIDCj+SM+XEmyXMemT5HnGjuSO/amyQ9MlyMiTnXOfZIAoDnrULzOCSydaNxKctLRnLkWwgKi5TkYPKqAeIAgCAICE77uDnx5ANY9raRGEtdQGJfQBpOIipdoBXOpJRWWd7fi1ggstgKC0iHwcIVaSCQHAhoNS54rQ3HPiWY5zl/J5+Xy/Bo7l/HcjL3A4Ja3DAeyFaY1jrQAsiC/0miIAfWaaOFLiC4Gl4V6g8xWXnDKtZ4jLsyl9f6/I7BHl2vpaFadJHwVuMnHgZs6cZ9YtcXw+T3navW1kePRqXL6ji+Hye87U2sh6NS5fUvQYLWijRQY14cm+J0hTjBYiUzMyGAE1vzKYxcuBFSrGmssscZszO1DaveyZx9LpjjNmZ2obVGyY9LpmRLTAeCRW669eZRceJ2p1VUWUXV5OhRHiWWudmBOoVQHz3gnc1Gn4MWYYaxuFdc4tDX+i1xvJqH1fmp0hdJVFF4Z5p0XOOUaSewXHg/tYT2UNKlps1BpQPHom/MV7Uk+DOcoyjxR1beviUkGHNEf+ZdFwKFZ4qZJfOzXCOBpS6lP66kisHipU1vJXEnSYQh0xZc/do1KFHfk9Os3DSeSU5wYIpWvdnyaNSSjkinV0Z3FqXjWXh2PxUtZR5hLTLUZ0pHtxi6lPRxalzmsRLNCeurnuNkuBoBAEAQBAEAQBAajdXJsiSkW02pYx0RnQ9jCWnWuVWEZR9Y60ZuM1g5PBni+GLBq12MEm4/aAWQ047pGvue86nuRweGS0J7mgxS0+m4enYe4ENtY6Ua006Fq28WqabMq4nmbS4G8Xc4BAEAQGuwx6rdJ+C7Ue0pXnBGJJSZiVoQKZ+n+y6uWCrTpOpnAnZMwyASDUZEUsipSdPGTNwP6rtPguNXiXLPqvxM9ci2UxGWmlucEaxRAcc3rJkQnzMs8UfDdbFxc648HFDQATjbDxeCiuuDOlpLDcSdYYmYTJV8SLDqxrTEMMtaSbPp+qbq1FdK4Liku0uyxpba4bzWbgJlkaXdEbDaxrosVwYAKNFvSBXP0krRisRSPna7UqreP78iUcG3MNTfmKTxhcvp+Rwbcw1N+YoJ0rl9PyODbmGpvzEDil2fT8jg25hqb8xBhcvp+SqRAEa7k5OrMT8V5qdU92/vfI2i4GgEAQBAEAQBAYE1hiEw0qXHM2/vxKjW6QoUnjOX3FmnaVJrPBd5pcK4bc+E9jWAWmubUmpFoEVu09Kz6nSrnmKjhMuU7FRak2QDBOBnwp6HGa1hYC4uY4gtvY4erlFTWmQp6alT5vsydnS1bsnSpfdDkey7O3Ydq90ul9+Kkfh+CtPo//g/ibyFFDgHNNQcRWzCcZxUovKZnSi4vDKl6ICAIDXYYxN0n4LtR7SlecEYEtMOY603+BGYrq1kpwm4PKPJiO57rTsfcBmCJYInNzeWbLA/qu0+C41eJfs+q/Ez1yLYQHKt1+4ychz7p6SdDbaNuhiNY4PIo+54suacePKblM6tOMfaPC7zzGE9WYI3EXBkxFwa9kV4MzEgFhLiA0Pc2+pYKAX5AqqlCM9pnd9jSlqlQ2eN+N/iZO47c0+XlWweFhxCC5xLCbILjWgqKmme7QrtO5pzWYvPgYdezq6t+7xN3xY/7Ov8Agum1icfRKnd/fIohQqKrWratyNSzs9ksy4v5GQ2XiEVaQB0/2XSjJJbzjeU5yn6mD3yWNnb3bF11wKmwrc1/fIuycq9r7TqYqXdXQvM5prCOlGjOM9UjOXIthAEAQCqEZQqgyjSYdwnT6Jhv+sRk+yFjdJXrj7Km9/a/saNnbqXry4dhH1hGoUGIF60sDhR/QTS+RJ5wo/oJpfIjBn4LwtwRzsOMeI6Vds7qdu96bjy+6/u8r3Fsqq3cSWQJhr2hzSCDlX0sJxnHVHgYkouL0y4lxeiC1HmWM9ZwbpPgudStTp9eSR7hTlPqrJBt0mFI0SODDvhtIDG0N7jcHObdWpxaBlWY79zq+z7OHJl6NnDZ4qce3uJJgjBsTg6zFLZOJpuA261r0qtXT6+MmTUtKGfUzgzuLYfTrXTayOfolMvy8u1gIblvvXmUnLidadONNYRdXk6GLhKb4OGXZcQ0nFt6lWu66o0nLt7PE60Ke0mokTZGJeHPJdffW8r5mnV9qp1N+823BKDjHcZszhLIzWfALRr9IrGKXxOMKH/I18OIWm00kHOMayYzlGWqLwyzKKksNbiW4OnOEhWsoFHaQP6PWvqrS4Vakpdvb4mHWo7OppLUmwF1Dmr8F7gss7VpOMdxsV3KQQBAEAQBAEBoIcK1Es4qup3q23hGPp1VMd5VhmAyC0AOJecQoLhnKzOkOkNhDEes+Hd3mpadGqrPLfqrj+DQr5Jtt5Z9OkksIyZOWLjiqM2el5Wt0Z0ftntKnVXz/RldJX7pLZU+s/kvyZq+rPlXv3npBFOm8dN9PBMhxwetaTivy9QxpkKOeBTVCMI9c0ilRjFR0hQ3uPSTyi7Mbog5gMIGpxlw9XIQM56cS+ar9KrQtkt759h9bTsGpPacF8zSPeSakkk4ycaxZScnqk8s0VFRWEbfc7JVfwpFzbm/eNKkaKLV6Kt3KTqvguHj+ihfVcLQvPwJBHcQ0kY1vSeEZsEnLea/yh3KXHWy4qUORdgTZFzrxnyr1GfM5zoLjEzWuBFQupWaa3Mju6eriB9UAj8RyrE6WUm4y7F9TTsYpJ82aWG6oBzgFYr4mgipQCiKbqZTdrx91SpRDNrgWKWl4+qRQ6a3fErU6Lc1KXLG/wAewq3UFLHNfQ3Mj6/UfBbdPiUq/VNguxTCAIAgCAIAgI95QIb7ZyEmmfHcvd1cRoUnOX+2Z9tRlVuFGPP4I1U1MOiPL3Xk93QOhfF1qsqs3OXFn2NOnGnFRiey0sX1IxNoXHNU0HWrFjaO5q6eztf95le9ulb0nLt7DdYPm+CrdUYqYu9fZbOKiox3JHyMK7UnKW9ssRYlXF3TXYvSRylLMsmVOT9tobSlNF93deoUcM61K2uOMHkhO8HW6taXfFJRyRSq6MmM+IS61lrVesHJy35MmfnuEaBSlO/NoXjThM7zra8JcyLSTaQwNPeSV8DnJ91JYZt8F4LdFNTczPn6G7Ves7GVd5e6PPn4fkp3FyqSwuJKYcMNAaBQC4BfSwgoRUYrCRjOTk8sqXogpMMY6DUowidT5lialq3jH8V5lDPA60qunc+Bhw4hablyTaLMoRmt5SIdo2aVqvLip+q+09OSgsmin5XgormD1Qat0EA/ElfO3tJUqzjHgXLao5002WFVO5mYIl2xI1l2Ky49dAKj2lf6PpRq1HGXDD+xVu6jhBSXM2vkwZ6AuodfStuFGNJaIldVNfrGVI+v1FdocTjX6psF2KYQBAEAQBAEBFcIQya0yEnqvVXpihKpbqUf47/LH2OXRVeNO5cZfy3eZq3wwca+UTwfUNZNrgydDYToJFKkEHOai4+C2+h7uMZbKW7PB9/J/YyOlreUqbqR347DMhsZQVpX79O6yvpd583FRxv+v6KuDZ0dp/Ko3nrTH+v9Dg2dHafypvGmP9f6HBs6O0/lTeNMf6/0ODZ0dp/Km8aY/wBf6LcdjaXfmteAU7zy0ljH1L8luehspaJfTEDcOsDGsCj0VSg8yeo+mq39SfBYNwBRamMbkUQgCAIAgMeYlrV4uPxXiUMnWnVcdz4FUtAs6UjHAqVNZHd0f7f8I8V890r/APR5L7mnY+68zWLNLhnYCiUmGdIc3W2v6Vo9FySuN/aminerNLzJNNQLQqMY7+hfRSjkzKVTS9/AtScEh1SKLzCLT3nStUTWEZi6lYIAgCAIAgCAjrnEOJGOp+KuYyjGk2pNo101ApeMXwXyvSXRzovaU+r9P0fTdG9IqstnU631/ZjrINc20rNvLBRzhkuJX2tjX29CM3x4PxR8bfUnb15Qi93FeDLvlL+W72ireEVNpLmypk27K5x/GQmESqku1v4lflh+32h2KNJO18fiPLD9vtDsTSNr4/Etxo9qg9LHlcXeCnGCJT1f7N+qhsBAEAQBAEAQHjjQVOIXqG8LLCWdxC52Y4SI5+c3aMncvkLittqjnz+nYfQUaezgollcToescQQRjF40hTGTi012ENJrDJnIzIiQ2vGXH0OFxGtfX29VVaanzMCrDZzcS+uxzCAIAgCAIAgCA0MSXfU+i7Gchzq3qWOJkSpT1PcyjyZ/IdqKhuL3MhU6i3pMxouC342tI6CDRYd10PCT1UpY7uzy5G5bdKVYrTVg339vmRvCE1GgRaUcw4yHCgfkrTKLqV0qnQVa0eOD5djNGpTo3cN6z39qN9K4QY9gdaAqLwSKg5Qt+F7QlFNySfJs+bq9H3EJuKg2uaTLvlcPFbbX7wXv0u3/AOcfijn6Hcf9cvgz3ylnLbrCj0y3/wCyPxQ9Cuf+uXwZegi2Ks9IYqtvFc1y6wrU5rMZJ+DPErerB4lFryLgl38h2or1qXM8qlPkyQKqbAQBAEBZAdb+zp6PgueJa+46erp7y8uhzCA1W6mc4GTjRBjDaD7ziGjvKlUNv7POM7jzKrslr5HMJbD8dxpSH7Lv/pVZ/wCMrsqfL9nRdOtLfD5mQ7Ckc5YY0MPi5I/41D+VT5fs8y6el2Q+Zix48R3rxX0zA2Bo9Gner1LoK1hvab8SpU6YuJ8MIlW97Ohj3S+JrqvaPtjHrF/4VZuLaFOCcFjBztric5tTeck8VEvhAedX9Z1APQpAQBAEAQBAEAQEe3cS7DKuiFoMRlAwmtxc9tcWMXJG1hcTUZkSuZ0IOUSAy+EnsABgsd0tdSuuq5Vv8cpzeY1GvFZ/BNPp6pFYlFPwePyXuOW5YB1gqr/6zU7Kq+DLC6fi+MH8UWouHWtxQKVzkD4Be4/4zJ9ar8F+zy+nkurD5/pks3u8McNwzC0NcC14AytNQdRA1hXV0bGyjiDbzxzzK/p0rqWZLGCZKD0EAQBAEAQBAEBEN8+PZk2t5cVoOgNc74gK7YrNTPcVbx+pjvOXw3kEEYwtUzTbQYocKj+y8HhrBWoIM3Acfg5mE4XUe3UTQ9xK8VY6oNdx0oy01E+86yViG4edagkIQehSAgCAIAgCAIAgI1u/i0lmt5UQag1x2K3ZrNTPcU714p47zny0zLKYjqAnMFINQ95Jqca9nQ324Sd4Keh5n1hH8WL94NVe7hqpPu3ne3lpqI7CsU1QSgPKqMg9UgIAgCAICC76z/ooAzvedTQPFaFh1pFK84I5wtIoGRIk2wBlrXUSoZDNmvB4PWuoQc1+pHvCeDsoWCfQBAEAQBAEAQBAEAQBAQ7fFiXQW5y92oNHiVfsVvkzPvn1V4kKV8zzyLAc6HEs/VbbP3Q5oP5k1JNZPUIt8DSroeiuDFLHNe31mkOGlpqO8I1lYGcbzvcGKHta8YnAOGgio+K+eaw8G2nlZNXGilxJP9lmzm5PJowgooy5GISCDfTErFCbaaZXrwSaaMxWSuEAQBAEBA99cehL/eifBi0LDjIpXnBHOlpFAzsDQ6xT0MiO1Q3LxUeF5r6kpZz4MzVByPHYlIOzMxDQPgsB8TfXA9QkIAgCAIAgCAIAgCAgu+G/6aE3MwnW6n6Vo2S9Vszb5+siJq6USUbi8HCKyZBxOh8F7YNfg1U7qppcfHJdtIalL4HPXNINDjFx0haHErHiA7RuNmLchAOZlj2CW/pWJcxxVka1B5poz40kCag0VCdBN5RdhXcVhl6BBDRQa11hTUFhHOc3N5ZcXs8BAEAQBAQjfVZ9BBdmiEa2E/pV+wfrPwKd71V4nNVpmebnctDrFi9EvHPuztXGu8JeK+p0prOfBlS9Fc9Y2pAzkDWjJW9nZQsE3wgCAIAgCA9cEYPEAQBAEBz3d87/ADQGaG38zz4rUs17PzMq9ftPIjatFQ6JuEgWZS1y3ud1Cjf0lZd3LNTHI1bOOKeeZzfdbKcFPR25C8vGh/p3e1TqWlby1UkynWjpqNGoXY5HVd7ONakS3kRHt1hrv1LJvVir5GlaP2fmSxUy0EAQBAEAQBARPfMhVkQeTFY7WHN/Urli8VPIq3a9n5nKlrGaSTcLDtR43/rRu+yPFVrp4ivFHegst+DMYLsVDKwXDtR4Tc8Rg/eC8VHiDfce6azNLvOuLDN0IAgCAIAgLhC9EFJaowMlKgkIAgOb7uXf50j7DR3V8Vq2nuvMybz3vkjQqyVTrOBJfg5aEzKGNrpIqe8lYtWWqbZuUY6YJdxAN9KUszEKLy2Fp0sdseNS0LGWYOJSvI4kmQpXiodK3qnfQRhmiA62AfpWZf8AWXgaFm/VfiTdUC4EAQBAEAQBAaLdzBtYPjjMGu9l7T4KxavFVHG4WabONraMkl+9rDrHjf8AgcNbmqnevEY+JatVmT8DVNxKyUTbblYdqcgj7Rd7LS7wXC4eKTO9ss1YnUVjmyEAQBAEAQF1ejyEAQBCQmCDmG7i+diaGfkatS192jKuves1UjA4SKxnKe1utwC7TeItnCEdUkjsVgLEwbpDd9CUtSjYmWHEHsuBae+yrljLFTHNFW7WYZ5M5atUzjo+9SPoo/32flKzb/rR8C/Z8GTpZ5dCAIAgCAIAgMLDcC3LRmcqG8dZYaL3SeJp954qLMGu44WF9AYxOd6tn0sc/YaNbjsWff8AVj4lyz4s0JFLsytlAkO4KFWbqfqscdFaN/UVVvHin5lqzXtPI6Kss1QgCAID0BAe2VOCMlakgIAgCAIDmG7X/XRPwf8AG1att7tGTde9Y3Fy9udh5mhzz1NIHeQlzLFNi1jmojp6yjWNTurlOFko7MZ4MuH3m+kO9q60Jaaifec60dUGjh63DJOlb1Q+gjH/AHANTBtWXf8AWXgaFn1X4k3VAuBAEAQBAEAQCiA4HNQbER7OQ5zPZcR4L6GLzFMxGsPBOt6dvpTB6IY74mxZ/SHCPmXLLi/I0E02kR4zOcP3irkeCKEuLJZvdwvSjP6Gt1kk/AKlevckXbFb5MmwCzzRKrKnBGRZTAye0U4B6hAQBAEAQBAEBzDdr/romhn/ABtWra+7Rk3XvWbXe5l/TixMzWsHWST+ULjePckdrKO9snSoGgeEA3HEbupAcBnpbg4sSGfqPcz2XEeC34y1RTMZrDaOkb1rf8pEOeMe6HDWXf8AvF4fdmhZ9R+P2RMlSLYQBAEAQBAEAQHGN2UvYn44zvt+2A74krctpZpRMiusVGSveob6EwftQxqDz4qnf8Y+ZasuEiPYUbSPFH+4/wDOVcp9ReBn1Ou/Fk43AwaSzncp51AAfGqzrx5njuNGyjinnvJS0Ksi2eoQEAQBAEAQBAEAQBAc03bQj5a8gE1DMn2BsWra+7Rk3fvWSfcFLFkqXEUL3udfmFG/pOtVLt5qY5FyzjinnmSRVS0EBx7d9Ilk/FIBo+zEFBnaAe8FbNo3Kku4y7nEajJnvbQyJG8UrEefyjwVC+975Fy092SlUy0EAQBAEAQBAEBzHfPlCJpkQC58MD8THEHuLVq2M/Ua7zOu4vWmbjerZSBGNMcQDUwbVwv3ma8DrZrEX4kew7DImo13/Uf+Yq3SktC8CjWi9o93adF3NS9iUgty2Q46XkuP5lmV5aqjZqUI6aaRt1zOoQgIAgCAIAgCAIAgCAgW6u0+ZJhWSKAGvKFQadFKd6o1OnZUJOnTw0u5vf8AEsR6Ip1ltKmU3ya4fAmGBoYbLwwOSNZFT31V2NbbJVOe8r7JUvZrsM1SAgIPu8kS+NDLKWrFHVOS0bPxd3KvW6ZnZNU4Y3796/aOtLo2nc5nPPLd/o2+5RzGS7IVoWxUuBOUkn0c4UU+kY3b1NrVy4Eys3brTFPTzN4u5zCAIAgCAIAgCAwcMsrCrmIPh4rjWWYlq0lipjmVYIH0Q0n4lTR6h5un7VmBhCHWYAz2di41F7QtUJYoN8sm9bjVxGaVqTyEAQBAEAQBAWZuZZChvixHBrGNL3OOJrWglxOgAqQRbzm4J517mP8ALU6WRqQ85uCede5j/LTSxqRZnd83BnBu4OZtPobI4KKKnJe5gA6yudaM9m9HHG49U5Q1LVwIh/jWV5RXzX/i7jkbPp1HmSfAm+Rg1sBrYkxYcK3cHFddaJF7GEd63rGjUp0FCa3rP1Mu5qwnUco8DO85uCede5j/AC1b0s4akPObgnnXuY/y00sakRjDW72SfHc5kS0y4B1ktqA0ZHAEX1xhYN9Y16tZyS3bjUtbqlCmot7zB/xrK8oqp/4u45Hf06jzNjg/fKgMcA6ISyorW+gzjL1K/bUr2lJKSzHv/JVrTtpptPDJD5y8Fc69zH+WtjRIztaHnLwVzr3Mb5aaJDWh5y8Fc69zG+WmiQ1oecvBXOvcxvlpokNaHnLwVzr3Mb5aaJDWh5y8Fc69zG+WmiQ1osx99HBjaUivifdhPFNNto7l6jTzxeDzKrjgslI32cGj/u+x/FdNkua+f4Oe1fJ/L8lyFvpYMfUujOh05UKIa6LDT3rxOnjhvOkKmeO4oO+xg0XB0QgXVEM0PSK0OtelTWOK+f4PDqPPB/L8l2X30MFuBJjuh34nQohOn0GkLy4Y4bz3Gplb9xd85uCede5j/LUaWetSHnNwTzr3Mf5aaWNSHnNwTzr3Mf5aaWNSJHgjCkGZgtjwHh8J1bLgCK2XFpFHAEEEEXjIoJRmKAEAQHjmgggioNxBvBGYhAYHEcrzaB2LNinIwhxHK82gdizYmRhDiOV5tA7FmxMjCHEcrzaB2TNiDA4jlebQOxZsTIwhxHK82gdizYmRhDiOV5tA7FmxMjCHEcrzaB2TNiDCBwHK82gdkzYgwUHAcrzaD2TNi85ZOEecSSvNoPZM2JljCHEkrzaD2TNiZYwhxJK82g9kzYmWMIcSSvNoPZM2JljCHEkrzaD2TNiZYwhxJK82g9kzYmWMIcSSvNoPZM2JljCHEkrzaD2TNiZYwhxJK82g9kzYmWMIrGApXm0DsmbFKyRhHvEcrzaB2LNinIwhxHK82gdizYmRhDiOV5tA7FmxMjCHEcrzaB2LNiZGEZkGC1jQ1jQ1oxNaAANAFwUAuIAgCAIAgCAIAgCAIAgCAICh6hkopUEhAEAQBAEAQBAVMUohlakgIAgCAIAgCAID/9k=",
//   },
// ];
 
// const handleGetStarted = () => {
 
//   if (owner?.username) {
//     navigate(`/${owner.username}/dashboard`);
//   } else {
//     navigate("/login");
//   }
// };
// // const handleGetStarted = () => {
// //   setWantsToProceed(true);
// // };


//   return (
//     <div className="bg-black text-white min-h-screen font-sans">
//       {/* Hero Section */}
//       <section className="relative min-h-screen flex items-center justify-center px-4 py-20 overflow-hidden">
//         <div className="max-w-7xl w-full grid md:grid-cols-2 gap-12 items-center">
//           <div className="space-y-6 z-10">
//             <h1 className="text-5xl md:text-6xl font-bold leading-tight">
//               Transform Dining<br />
//               <DynamicGradientText/>
//             </h1>
//             <p className="text-gray-400 text-lg leading-relaxed">
//               Revolutionize your restaurant experience with cutting-edge augmented reality 
//               and AI-powered insights. Enhance customer engagement, streamline operations, 
//               and boost sales with immersive menu visualization.
//             </p>
//             <div className="flex flex-wrap gap-4">
//               {/* <button 
//                 onClick={handleGetStarted}
//                 className="bg-cyan-500 hover:bg-cyan-600 text-white px-8 py-3 rounded-lg font-semibold transition-all transform hover:scale-105 shadow-lg"
//               >
//                 Get Started
//               </button> */}
//               <button 
//               onClick={handleGetStarted}
//               className="bg-cyan-500 hover:bg-cyan-600 text-white px-8 py-3 rounded-lg font-semibold transition-all transform hover:scale-105 shadow-lg"
//             >
//               Get Started
//             </button>
//               {/* <button 
//                 onClick={handleRequestDemo}
//                 className="border border-gray-700 hover:border-gray-500 text-white px-8 py-3 rounded-lg font-semibold transition-all"
//               >
//                 Request Demo
//               </button> */}
//             </div>
//           </div>
          
//           <div className="relative z-10">
//             <div className="relative w-full aspect-square">
//               <canvas
//                 ref={canvasRef}
//                 className="w-full h-full rounded-full"
//               />
//               {/* Animated rings */}
//               <div className="absolute inset-0 rounded-full border-2 border-cyan-500/20 animate-ping" style={{ animationDuration: '3s' }}></div>
//               <div className="absolute inset-4 rounded-full border border-cyan-400/10 animate-pulse" style={{ animationDuration: '4s' }}></div>
//             </div>
//             {/* Background glow */}
//             <div className="absolute inset-0 bg-gradient-radial from-cyan-500/20 via-transparent to-transparent blur-3xl animate-pulse"></div>
//           </div>
//         </div>
        
//         {/* Background ambient particles */}
//         <div className="absolute inset-0 overflow-hidden pointer-events-none">
//           <div className="absolute top-20 left-10 w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
//           <div className="absolute top-40 right-20 w-1 h-1 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
//           <div className="absolute bottom-40 left-1/4 w-1.5 h-1.5 bg-cyan-300 rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
//         </div>
//       </section>

//       {/* About Section */}
//       <section className="py-20 px-4 bg-gradient-to-b from-black to-gray-900">
//         <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
//           <div className="space-y-6">
//             <h2 className="text-4xl md:text-5xl font-bold">
//               About Dishpop:<br />
//               <TypewriterText text="The future of Dining" 
//               className="text-cyan-400"  
//               speed={90}/>
//             </h2>
//             <p>
//               <TypewriterText text="Dishpop is an innovative platform that combines augmented reality 
//               technology with artificial intelligence to transform the restaurant industry. 
//               Our solution enables customers to visualize menu items in stunning 3D, 
//               provides real-time analytics for restaurant owners, and creates an 
//               unforgettable dining experience that drives customer satisfaction and loyalty."
//               className="text-gray-400 text-lg leading-relaxed"
//               speed={15}
//               />
//             </p>
//             <p className="text-gray-100 text-lg leading-relaxed">
//               Join thousands of restaurants worldwide who have already elevated their 
//               dining experience with dishpop technology.
//             </p>
//           </div>
//           <div className="grid grid-cols-2 gap-4">
//             <div className="space-y-4">
//               <img 
//                 src="https://images.unsplash.com/photo-1552566626-52f8b828add9?w=400&q=80" 
//                 alt="Restaurant interior" 
//                 className="w-full h-48 object-cover rounded-lg shadow-lg"
//               />
//               <div className="bg-white rounded-lg p-4 shadow-xl">
//                 <img 
//                   src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&q=80" 
//                   alt="Food menu" 
//                   className="w-full h-32 object-cover rounded"
//                 />
//               </div>
//             </div>
//             <div className="mt-8">
//               <img 
//                 src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&q=80" 
//                 alt="Fine dining" 
//                 className="w-full h-64 object-cover rounded-lg shadow-lg"
//               />
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Features Section */}
//       <section className="py-20 px-4 bg-gray-900">
//         <div className="max-w-7xl mx-auto">
//           <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">
//             How Food Appears in AR
//           </h2>
//           <p className="text-gray-400 text-center mb-16 max-w-2xl mx-auto">
//             Experience the future of menu presentation with our innovative AR technology
//           </p>
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//             {features.map((feature, index) => {
//               const Icon = feature.icon;
//               return (
//                 <div 
//                   key={index} 
//                   className="bg-black rounded-xl p-6 hover:bg-gray-800 transition-all hover:transform hover:scale-105 border border-gray-800 shadow-lg"
//                 >
//                   <div className="mb-4 overflow-hidden rounded-lg">
//                     <img 
//                       src={feature.image}
//                       alt={feature.title}
//                       className="w-full h-48 object-cover hover:scale-110 transition-transform duration-300"
//                     />
//                   </div>
//                   <div className="bg-cyan-500 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
//                     <Icon className="w-6 h-6 text-white" />
//                   </div>
//                   <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
//                   <p className="text-gray-400 text-sm">{feature.description}</p>
//                 </div>
//               );
//             })}
//           </div>
//         </div>
//       </section>

//       {/* CTA Section */}
//       <section className="py-20 px-4 bg-gradient-to-b from-gray-900 to-black">
//         <div className="max-w-4xl mx-auto text-center bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-12 border border-gray-700 shadow-2xl">
//           <h2 className="text-4xl md:text-5xl font-bold mb-4">
//             Register Your Restaurant Today
//           </h2>
//           <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
//             Join the AR dining revolution. Transform your restaurant's customer experience 
//             with cutting-edge technology. Start your free trial today and see the difference.
//           </p>
//           <div className="flex flex-col sm:flex-row gap-4 justify-center">
//             <button 
//               className="bg-cyan-500 hover:bg-cyan-600 text-white px-8 py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 shadow-lg"
//             >
//               Partner With Us <ChevronRight className="w-5 h-5" />
//             </button>
//             <button 
//               onClick={handleGetStarted}
//               className="border border-cyan-500 hover:bg-cyan-500 text-white px-8 py-3 rounded-lg font-semibold transition-all"
//             >
//               Register Now
//             </button>
//           </div>
//           <p className="text-gray-500 text-sm mt-6">
//             No credit card required • Free 30-day trial
//           </p>
//         </div>
//       </section>

//       {/* Footer */}
//      <footer className="py-8 px-4 border-t border-gray-800">
//   <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-gray-500 text-sm">
//     <p>© 2025 Dishpop. All rights reserved.</p>
//     <div className="flex gap-6 mt-4 md:mt-0">
//       <Link to="/privacy-policy" className="hover:text-cyan-400 transition-colors">
//         Privacy Policy
//       </Link>
//       <Link to="/contact" className="hover:text-cyan-400 transition-colors">
//         Contact
//       </Link>

//       <Link to="/about" className="hover:text-cyan-400 transition-colors">
//         About us
//       </Link>
//       <Link to="/terms-of-service" className="hover:text-cyan-400 transition-colors">
//         Terms Policy
//       </Link>
//     </div>
//   </div>
// </footer>

//     </div>
//   );
// };

// export default LandingPage;
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, Utensils, TrendingUp, Users, ChevronRight } from 'lucide-react';
import DynamicGradientText from '../../components/DynamicGradient';
import TypewriterText from '../../components/TypeWriter';
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const LandingPage = () => {
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const { owner, loading } = useAuth();
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768 || 'ontouchstart' in window);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80';

    let animationId;
    let rotation = 0;
    let scale = 1;
    let scaleDirection = 1;
    let floatY = 0;
    let floatDirection = 1;

    const animate = () => {
      const width = canvas.width;
      const height = canvas.height;

      // Clear with subtle gradient
      const gradient = ctx.createRadialGradient(width / 2, height / 2, 0, width / 2, height / 2, width / 2);
      gradient.addColorStop(0, 'rgba(17, 24, 39, 1)');
      gradient.addColorStop(1, 'rgba(31, 41, 55, 1)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      ctx.save();

      // Move to center with floating effect
      floatY += 0.3 * floatDirection;
      if (floatY > 15 || floatY < -15) floatDirection *= -1;
      ctx.translate(width / 2, height / 2 + floatY);

      // Smooth slow rotation
      rotation += 0.003;
      ctx.rotate(rotation);

      // Smooth breathing scale effect
      scale += 0.0003 * scaleDirection;
      if (scale > 1.03 || scale < 0.97) scaleDirection *= -1;
      ctx.scale(scale, scale);

      // Add glow effect
      ctx.shadowBlur = 40;
      ctx.shadowColor = 'rgba(6, 182, 212, 0.4)';

      // Draw image
      const imgSize = Math.min(width, height) * 0.85;
      if (img.complete) {
        // Create circular clip
        ctx.beginPath();
        ctx.arc(0, 0, imgSize / 2, 0, Math.PI * 2);
        ctx.clip();
        ctx.drawImage(img, -imgSize / 2, -imgSize / 2, imgSize, imgSize);
      }

      ctx.restore();

      // Add sparkle particles
      ctx.fillStyle = 'rgba(6, 182, 212, 0.6)';
      for (let i = 0; i < 3; i++) {
        const angle = rotation + (i * Math.PI * 2) / 3;
        const distance = (width / 2) * 0.7;
        const x = width / 2 + Math.cos(angle) * distance;
        const y = height / 2 + Math.sin(angle) * distance + floatY;
        const size = 2 + Math.sin(rotation * 2 + i) * 1;
        
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
      }

      animationId = requestAnimationFrame(animate);
    };

    const handleResize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    img.onload = () => {
      handleResize();
      animate();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const features = [
    {
      title: "Menu Visualization",
      description: "Let customers see dishes in 3D before ordering with immersive augmented reality previews.",
      icon: Camera,
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTmpc_igRYqatIrc5KMJ7fOprCk5qNcARxs3g&s",
    },
    {
      title: "AR Menu Insights",
      description: "Understand which dishes customers explore the most in AR and optimize your menu accordingly.",
      icon: TrendingUp,
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
    },
    {
      title: "Live Ordering Management",
      description: "Track and manage live orders in real time with seamless kitchen and front-desk coordination.",
      icon: Utensils,
      image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&q=80",
    },
    {
      title: "Customer Feedback",
      description: "Collect real-time feedback and ratings from customers to continuously improve service quality.",
      icon: Users,
      image: "https://images.unsplash.com/photo-1556742111-a301076d9d18?w=400&q=80",
    },
  ];

  const handleGetStarted = () => {
    if (owner?.username) {
      navigate(`/${owner.username}/dashboard`);
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="bg-black text-white min-h-screen font-sans">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 py-20 overflow-hidden">
        <div className="max-w-7xl w-full grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 z-10">
            <h1 className="text-5xl md:text-6xl font-bold leading-tight">
              Transform Dining<br />
              <DynamicGradientText/>
            </h1>
            <p className="text-gray-400 text-lg leading-relaxed">
              Revolutionize your restaurant experience with cutting-edge augmented reality 
              and AI-powered insights. Enhance customer engagement, streamline operations, 
              and boost sales with immersive menu visualization.
            </p>
            <div className="flex flex-wrap gap-4">
              <button 
                onClick={handleGetStarted}
                className="bg-cyan-500 hover:bg-cyan-600 text-white px-8 py-3 rounded-lg font-semibold transition-all transform hover:scale-105 shadow-lg active:scale-95"
              >
                Get Started
              </button>
            </div>
          </div>
          
          <div className="relative z-10">
            <div className="relative w-full aspect-square">
              <canvas
                ref={canvasRef}
                className="w-full h-full rounded-full"
                style={{ 
                  touchAction: isMobile ? 'pan-y' : 'auto',
                  pointerEvents: 'none'
                }}
              />
              {/* Animated rings */}
              <div 
                className="absolute inset-0 rounded-full border-2 border-cyan-500/20 animate-ping pointer-events-none" 
                style={{ animationDuration: '3s' }}
              ></div>
              <div 
                className="absolute inset-4 rounded-full border border-cyan-400/10 animate-pulse pointer-events-none" 
                style={{ animationDuration: '4s' }}
              ></div>
            </div>
            {/* Background glow */}
            <div className="absolute inset-0 bg-gradient-radial from-cyan-500/20 via-transparent to-transparent blur-3xl animate-pulse pointer-events-none"></div>
          </div>
        </div>
        
        {/* Background ambient particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
          <div className="absolute top-40 right-20 w-1 h-1 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute bottom-40 left-1/4 w-1.5 h-1.5 bg-cyan-300 rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-4xl md:text-5xl font-bold">
              About Dishpop:<br />
              <TypewriterText text="The future of Dining" 
              className="text-cyan-400"  
              speed={90}/>
            </h2>
            <p>
              <TypewriterText text="Dishpop is an innovative platform that combines augmented reality 
              technology with artificial intelligence to transform the restaurant industry. 
              Our solution enables customers to visualize menu items in stunning 3D, 
              provides real-time analytics for restaurant owners, and creates an 
              unforgettable dining experience that drives customer satisfaction and loyalty."
              className="text-gray-400 text-lg leading-relaxed"
              speed={15}
              />
            </p>
            <p className="text-gray-100 text-lg leading-relaxed">
              Join thousands of restaurants worldwide who have already elevated their 
              dining experience with dishpop technology.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <img 
                src="https://images.unsplash.com/photo-1552566626-52f8b828add9?w=400&q=80" 
                alt="Restaurant interior" 
                className="w-full h-48 object-cover rounded-lg shadow-lg"
              />
              <div className="bg-white rounded-lg p-4 shadow-xl">
                <img 
                  src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&q=80" 
                  alt="Food menu" 
                  className="w-full h-32 object-cover rounded"
                />
              </div>
            </div>
            <div className="mt-8">
              <img 
                src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&q=80" 
                alt="Fine dining" 
                className="w-full h-64 object-cover rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">
            How Food Appears in AR
          </h2>
          <p className="text-gray-400 text-center mb-16 max-w-2xl mx-auto">
            Experience the future of menu presentation with our innovative AR technology
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div 
                  key={index} 
                  className="bg-black rounded-xl p-6 hover:bg-gray-800 transition-all hover:transform hover:scale-105 border border-gray-800 shadow-lg cursor-pointer"
                >
                  <div className="mb-4 overflow-hidden rounded-lg">
                    <img 
                      src={feature.image}
                      alt={feature.title}
                      className="w-full h-48 object-cover hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <div className="bg-cyan-500 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-gray-400 text-sm">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-4xl mx-auto text-center bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-12 border border-gray-700 shadow-2xl">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Register Your Restaurant Today
          </h2>
          <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
            Join the AR dining revolution. Transform your restaurant's customer experience 
            with cutting-edge technology. Start your free trial today and see the difference.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              className="bg-cyan-500 hover:bg-cyan-600 text-white px-8 py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 shadow-lg active:scale-95"
            >
              Partner With Us <ChevronRight className="w-5 h-5" />
            </button>
            <button 
              onClick={handleGetStarted}
              className="border border-cyan-500 hover:bg-cyan-500 text-white px-8 py-3 rounded-lg font-semibold transition-all active:scale-95"
            >
              Register Now
            </button>
          </div>
          <p className="text-gray-500 text-sm mt-6">
            No credit card required • Free 30-day trial
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-gray-800">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-gray-500 text-sm">
          <p>© 2025 Dishpop. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <Link to="/privacy-policy" className="hover:text-cyan-400 transition-colors">
              Privacy Policy
            </Link>
            <Link to="/contact" className="hover:text-cyan-400 transition-colors">
              Contact
            </Link>
            <Link to="/about" className="hover:text-cyan-400 transition-colors">
              About us
            </Link>
            <Link to="/terms-of-service" className="hover:text-cyan-400 transition-colors">
              Terms Policy
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;