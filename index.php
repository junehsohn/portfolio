<!doctype html>
<html lang="ko" data-framework="backbonejs">
	<head>
		<meta charset="utf-8">
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	    <meta http-equiv="X-UA-Compatible" content="IE=Edge,chrome=1" />
	    <meta http-equiv="cache-control" content="no-cache" />
	    <meta http-equiv="pragma" content="no-cache" />
	    <meta name="author" content="J.H.Sohn" />
    	<meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1, user-scalable=no" />
    	<meta name="apple-mobile-web-app-capable" content="yes" />
		<title>optimistic range</title>
		<meta name="description" content="optimistic range is a portfolio of J.H.sohn in Seoul that creates Front-end development" />
    	<meta name="keywords" content="" />
    	<link rel="image_src" href="" />
	    <meta property="og:title" content="Portfolio | Optimistic Range" />
	    <meta property="og:type" content="image" />
	    <meta property="og:url" content="http://optimisticrange.net/portfolio/" />
	    <meta property="og:image" content="./image/icon_152.jpg" />
	    <meta property="og:description" content="optimistic range is a portfolio of J.H.sohn in Seoul that creates Front-end development" />
	    <link rel="shortcut icon" href="./image/favicon.png" type="image/x-icon">
		<link rel="icon" href="./image/favicon.png" type="image/x-icon">
	    <meta name="apple-mobile-web-app-capable" content="yes" />
	    <link rel="apple-touch-icon" href="./image/icon_57.jpg" sizes="57x57" />
	    <link rel="apple-touch-icon" href="./image/icon_72.jpg" sizes="72x72" />
	    <link rel="apple-touch-icon" href="./image/icon_76.jpg" sizes="76x76" />
	    <link rel="apple-touch-icon" href="./image/icon_114.jpg" sizes="114x114" />
	    <link rel="apple-touch-icon" href="./image/icon_120.jpg" sizes="120x120" />
	    <link rel="apple-touch-icon" href="./image/icon_144.jpg" sizes="144x144" />
	    <link rel="apple-touch-icon" href="./image/icon_152.jpg" sizes="152x152" />
	    <meta name="format-detection" content="telephone=no" />
	    <link rel="stylesheet" tyle="text/css" href="css/app.min.css" />
	    <script type="text/javascript">
			var Orange = Orange || {},
				buildNumber = "0.9.0.5",
				require = {
			        urlArgs : "bust="+buildNumber
			    };

			window.trace = function(__msg){
				try{
					window.console.log.apply(window.console, arguments);
				}catch(__e){};
			};
		</script>
		<script type="text/x-handlebars-template" id="not-supported-template">
			<div class="alert-popup">
				<h3 class="alert-title">
					Your Browser is currently Not supported.
				</h3>
				<div class="url"><a href="http://goo.gl/Za1CtN">http://goo.gl/Za1CtN</a></div>
				<h3 class="alert-title snd">
					this site is responsive web.
				</h3>
				<div class="qr-code"></div>
				<h3 class="alert-title snd">
					or upgrade your browser
				</h3>
				<h3 class="alert-title">
					<a href="https://www.google.com/chrome/">Download Chrome</a>
				</h3>
				<h3 class="alert-title">
					<a href="https://www.mozilla.org/firefox/">Download firefox</a>
				</h3>
			</div>
		</script>

	</head>
	<body>
		<div class="body-container">
			<nav id="navi">
				<aside class="icon">
					<div class="box"></div>
					<div class="box"></div>
					<div class="box"></div>
				</aside>
				<div class="nav-btn"></div>
				<h3 class="title"></h3>
			</nav>

			<div id="sec-cont" class="section-container">
			</div>

			<div class="bg-texture-layer">
				<div class="gradient-layer"></div>
				<div class="noise-layer"></div>
				<div class="dialog-layer">
					<div class="dialog-text">
						<div class="text-partial partial-top"><span class="text-inner-partial"></span></div>
					</div>
					<div class="dialog-text">
						<div class="text-partial partial-top"><span class="text-inner-partial"></span></div>
					</div>
				</div>
			</div>
		</div>
		<div class="loading-bar">
			<div class="loading-bar-txt">Loading...</div>
		</div>
		
		<?php
			preg_match('/MSIE (.*?);/', $_SERVER['HTTP_USER_AGENT'], $matches);
			if(count($matches)<2){
			  preg_match('/Trident\/\d{1,2}.\d{1,2}; rv:([0-9]*)/', $_SERVER['HTTP_USER_AGENT'], $matches);
			}

			if (count($matches)>1){
			  //Then we're using IE
			  $version = $matches[1];

			  switch(true){
			    case ($version<=9):
			      //IE 8 or under!
			      print '<script src="module/lib/jquery.min.js"></script>';
			      print '<script>$(".bg-texture-layer").css("display","none");$(".loading-bar").css("display","none");$("#navi").css("display","none");';
			      print '$(".alert-title").css({"color":"#FFFFFF !important"});';
			      print '$("#sec-cont")[0].innerHTML = $("#not-supported-template").html();';
			      print '</script>';
			    break;


			    default:
			      //You get the idea
			      print '<script data-main="dist/main-built" src="module/lib/require.min.js"></script>';
			  }
			}else{
				print '<script data-main="dist/main-built" src="module/lib/require.min.js"></script>';
			}

		?>


		
	</body>
</html>

















