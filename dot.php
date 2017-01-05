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
    	<!--<meta name="viewport" content="user-scalable=no, initial-scale=1, maximum-scale=1, minimum-scale=1, width=device-width, height=device-height, target-densitydpi=medium-dpi" />-->
    	<meta name="apple-mobile-web-app-capable" content="yes" />
    	<!--<base href="http://optimisticrange.net">-->
		<title>optimistic range</title>
		<meta name="description" content="optimistic range is a portfolio of J.H.sohn in Seoul that creates Front-end development" />
    	<meta name="keywords" content="" />
    	<link rel="image_src" href="" />
	    <meta property="og:title" content="Portfolio | Optimistic Range" />
	    <meta property="og:type" content="website" />
	    <meta property="og:url" content="" />
	    <meta property="og:image" content="" />
	    <meta property="og:description" content="optimistic range is a portfolio of J.H.sohn in Seoul that creates Front-end development" />
	    <link rel="icon" type="image/gif" href="" />
	    <meta name="apple-mobile-web-app-capable" content="yes" />
	    <link rel="apple-touch-icon" href="" sizes="57x57" />
	    <link rel="apple-touch-icon" href="" sizes="72x72" />
	    <link rel="apple-touch-icon" href="" sizes="76x76" />
	    <link rel="apple-touch-icon" href="" sizes="114x114" />
	    <link rel="apple-touch-icon" href="" sizes="120x120" />
	    <link rel="apple-touch-icon" href="" sizes="144x144" />
	    <link rel="apple-touch-icon" href="" sizes="152x152" />
	    <meta name="format-detection" content="telephone=no" />
	    <style type="text/css">
			body {
			  padding: 0;
			  margin: 0;
			  overflow: hidden;
			  background-color: #000;
			  color: #fff;
			  font-size: 12px;
			}
			canvas {
			  padding: 0;
			  margin: 0;
			}
	    </style>

	</head>
	<body>
		
		<div class="" id="example-container" style="position:absolute;display:block;width:100%;height:100%;background-color:#FF0000;"></div>



		<!--[if lt IE 10]>
		<script>
			document.body.removeChild(document.getElementById('example-container'));
		</script>
		<![endif]-->
		




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
	    	print "<script>alert('low ie');</script>";
	      break;


	    default:
	      //You get the idea
	    	print "<script>alert('hi ie');</script>";
	  }
	}else{
		print "<script>alert('not ie');</script>";
	}

?>














	</body>
</html>

















