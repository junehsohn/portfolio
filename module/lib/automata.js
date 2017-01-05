define(['jquery'], function ($) {
	'use strict';

    function AM(){
        this.codeArr;
        this.strPos;
        this.hsFstCodeArr = [0,1,3,6,7,8,16,17,18,20,21,22,23,24,25,26,27,28,29];
        this.hsLastCodeArr = [1,2,4,7,-1,8,16,17,-1,19,20,21,22,-1,23,24,25,26,27];
        this.keyIptArr = [];
        this.iptSentence = [];

        this.hangulStr01 = -1;
        this.hangulStr02 = -1;
        this.hangulStr03 = -1;

        this.cursorPos = 0;
        this.speed = 150;
        this.mixPos = 1;
        this.sentence = '';
        this.timer = null;
        this.$el = null;
        this.isEnd = false;
    }

    AM.prototype.reset = function(__str, __$el, __speed){
        this.stop();
        this.isEnd = false;
        this.$el = __$el;
        this.$el.html('');
        this.hangulStr01 = -1;
        this.hangulStr02 = -1;
        this.hangulStr03 = -1;
        this.iptSentence = [];
        this.keyIptArr = [];
        this.cursorPos=0;
        this.speed = (__speed)?__speed:150;
        this.codeArr = this.divideCode(__str); //test
        this.strPos=0;
        this.init();
    }

    AM.prototype.start = function(__str, __$el, __speed){
        this.reset(__str, __$el, __speed);
        this.timer = setInterval(this.render.bind(this), this.speed);
    }

    AM.prototype.stop = function(){
    	this.isEnd = true;
        clearInterval(this.timer);
    }

    AM.prototype.render = function(){
        if(this.codeArr[this.strPos]>127){
            if(this.keyIptArr.length>0){
                this.cursorPos+=2;
            }else{
                this.cursorPos++;
            }
            this.init();
            this.keyIptArr = [];
            this.iptSentence.push(String.fromCharCode(this.codeArr[this.strPos]-128));
            // console.log('onEF: '+String.fromCharCode(this.codeArr[this.strPos]-128));
            this.sentence = this.toStr(this.iptSentence);
        }else{
            this.keyIptArr.push(this.codeArr[this.strPos]);
            this.mixStr();
        }

        // console.log('sentence: '+this.sentence);
        if(this.$el[0]) {
            if(this.$el.prop('tagName').toLowerCase()=='input'){
                this.$el.val(this.sentence);
            }else{
                this.$el.html(this.sentence);
            }
        }
        this.strPos++
        if(this.strPos==this.codeArr.length){
            if(this.$el.prop('tagName').toLowerCase()=='input'){
                this.$el.val(this.sentence);
            }else{
                this.$el.html(this.sentence);
            }

            if(this.$el) {
                this.$el.trigger('AUTOMATA_COMPLETE');
            }else{
                $(window).trigger('AUTOMATA_COMPLETE', this.$el);
            }
            this.stop();
        }
        
    }

    AM.prototype.isComplete = function(){
    	return this.isEnd;
    }


    //문자열을 codeArr로 분리해서 배열로 반환합니다.
    AM.prototype.divideCode = function(str){
        var hg01, hg02, hg03, divideCodeArr = [], tmp;
        
        for(var i=0;i<str.length;i++){
            if(str.charCodeAt(i)>44031){
                tmp = str.charCodeAt(i) - 44032;
                //console.log(String.fromCharCode(tmp+44032));
                
                hg03 = tmp % 28;
                tmp = Math.floor(tmp/28);
                
                hg02 = tmp%21;
                tmp = Math.floor(tmp/21);
                
                hg01 = tmp;                                 //hg01, hg02, hg03으로 분리해놓고.
                
                divideCodeArr.push(hg01);                       //hg01 넣고
                
                switch(hg02) {
                    case 9:     //"ㅘ"
                        divideCodeArr.push(27);
                        divideCodeArr.push(19);
                    break;
                    case 10:    //"ㅙ"
                        divideCodeArr.push(27);
                        divideCodeArr.push(20);
                    break;
                    case 11:    //"ㅚ"
                        divideCodeArr.push(27);
                        divideCodeArr.push(39);
                    break;
                    case 14:    //"ㅝ"
                        divideCodeArr.push(32);
                        divideCodeArr.push(23);
                    break;
                    case 15:    //"ㅞ"
                        divideCodeArr.push(32);
                        divideCodeArr.push(24);
                    break;
                    case 16:    //"ㅟ"
                        divideCodeArr.push(32);
                        divideCodeArr.push(39);
                    break;
                    case 19:    //"ㅢ"
                        divideCodeArr.push(37);
                        divideCodeArr.push(39);
                    break;
                    default:
                        divideCodeArr.push(hg02+19);
                    break;
                }
                
                switch(hg03){
                    case 1:     //"ㄱ"
                        divideCodeArr.push(0);
                    break;
                    case 2:     //"ㄲ"
                        divideCodeArr.push(1);
                    break;
                    case 3:     //"ㄳ"
                        divideCodeArr.push(0);
                        divideCodeArr.push(9);
                    break;
                    case 4:     //"ㄴ"
                        divideCodeArr.push(2);
                    break;
                    case 5:     //"ㄵ"
                        divideCodeArr.push(2);
                        divideCodeArr.push(12);
                    break;
                    case 6:     //"ㄶ"
                        divideCodeArr.push(2);
                        divideCodeArr.push(18);
                    break;
                    case 7:     //"ㄷ"
                        divideCodeArr.push(3);
                    break;
                    case 8:     //"ㄹ"
                        divideCodeArr.push(5);
                    break;
                    case 9:     //"ㄺ"
                        divideCodeArr.push(5);
                        divideCodeArr.push(0);
                    break;
                    case 10:    //"ㄻ"
                        divideCodeArr.push(5);
                        divideCodeArr.push(6);
                    break;
                    case 11:    //"ㄼ"
                        divideCodeArr.push(5);
                        divideCodeArr.push(7);
                    break;
                    case 12:    //"ㄽ"
                        divideCodeArr.push(5);
                        divideCodeArr.push(9);
                    break;
                    case 13:    //"ㄾ"
                        divideCodeArr.push(5);
                        divideCodeArr.push(16);
                    break;
                    case 14:    //"ㄿ"
                        divideCodeArr.push(5);
                        divideCodeArr.push(17);
                    break;
                    case 15:    //"ㅀ"
                        divideCodeArr.push(5);
                        divideCodeArr.push(18);
                    break;
                    case 16:    //"ㅁ"
                        divideCodeArr.push(6);
                    break;
                    case 17:    //"ㅂ"
                        divideCodeArr.push(7);
                    break;
                    case 18:    //"ㅄ"
                        divideCodeArr.push(7);
                        divideCodeArr.push(9);
                    break;
                    case 19:    //"ㅅ"
                        divideCodeArr.push(9);
                    break;
                    case 20:    //"ㅆ"
                        divideCodeArr.push(10);
                    break;
                    case 21:    //"ㅇ"
                        divideCodeArr.push(11);
                    break;
                    case 22:    //"ㅈ"
                        divideCodeArr.push(12);
                    break;
                    case 23:    //"ㅊ"
                        divideCodeArr.push(14);
                    break;
                    case 24:    //"ㅋ"
                        divideCodeArr.push(15);
                    break;
                    case 25:    //"ㅌ"
                        divideCodeArr.push(16);
                    break;
                    case 26:    //"ㅍ"
                        divideCodeArr.push(17);
                    break;
                    case 27:    //"ㅎ"
                        divideCodeArr.push(18);
                    break;
                }
            }else{
                divideCodeArr.push(str.charCodeAt(i)+128);
            }
            
        }
        return divideCodeArr;               //분리된 codeArr들의 배열을 반환합니다.
    }


    AM.prototype.mixStr = function(){
        for(var i=0;i<this.keyIptArr.length;i++){
            if(this.mixPos==2 && this.hangulStr02!=-1 && this.keyIptArr[i]<=18){
                this.mixPos++;
            }
            
            switch(this.mixPos){
            case 1:     //hg01
                if(this.keyIptArr[i]<19){
                    this.hangulStr01 = this.keyIptArr[i];
                    this.mixPos = 2;
                }else{
                    this.hangulStr02 = this.keyIptArr[i]-19;
                    this.iptSentence[this.cursorPos] = this.mixHangul();
                    this.sentence = this.toStr(this.iptSentence);
                    this.init();
                    this.cursorPos++;
                    this.keyIptArr.splice(0);
                    return;
                }
            break;
            case 2:     //hg02
                
                if(this.keyIptArr[i]<19){
                    this.next(i);
                    return;
                }else{
                    switch(this.hangulStr02){
                    case -1:
                        this.hangulStr02 = this.keyIptArr[i]-19;
                        switch(this.hangulStr02){
                            case 8:
                            case 13:
                            case 18:
                            break;
                            default:
                                this.mixPos++;
                            break;
                        }
                    break;
                    case 8:
                        switch(this.keyIptArr[i]){
                        case 19:
                            this.hangulStr02 = 9;
                            this.mixPos++;
                        break;
                        case 20:
                            this.hangulStr02 = 10;
                            this.mixPos++;
                        break;
                        case 39:
                            this.hangulStr02 = 11;
                            this.mixPos++;
                        break;
                        default:
                            if(this.keyIptArr[i]>18 || this.hsLastCodeArr[this.keyIptArr[i]] == -1){
                                this.next(i);
                                return;
                            }
                            else{
                                this.hangulStr03 = this.hsLastCodeArr[this.keyIptArr[i]];
                                this.mixPos++;
                            }
                        break;
                        }
                    break;
                    case 13:
                        switch(this.keyIptArr[i]){
                            case 23:
                                this.hangulStr02 = 14;
                                this.mixPos++;
                            break;
                            case 24:
                                this.hangulStr02 = 15;
                                this.mixPos++;
                            break;
                            case 39:
                                this.hangulStr02 = 16;
                                this.mixPos++;
                            break;
                            default:
                                if(this.keyIptArr[i]>18 || this.hsLastCodeArr[this.keyIptArr[i]] == -1){
                                    this.next(i);
                                    return;
                                }else{
                                    this.hangulStr03 = this.hsLastCodeArr[this.keyIptArr[i]];
                                    this.mixPos++;
                                }
                            break;
                        }
                    break;
                    case 18:
                        switch(this.keyIptArr[i]){
                            case 39:
                                this.hangulStr02 = 19;
                                this.mixPos++;
                            break;
                            default:
                                if(this.keyIptArr[i]>18 || this.hsLastCodeArr[this.keyIptArr[i]] == -1){
                                    this.next(i);
                                    return;
                                }else{
                                    this.hangulStr03 = this.hsLastCodeArr[this.keyIptArr[i]];
                                    this.mixPos++;
                                }
                            break;
                        }
                    break;
                    }
                }
                
            break;
            
            case 3:     //hg03
                switch(this.hangulStr03){
                    case -1:
                        if(this.hsLastCodeArr[this.keyIptArr[i]] == -1 || this.keyIptArr[i]>18){
                            this.next(i);
                            return;
                        }
                        else{
                            this.hangulStr03 = this.hsLastCodeArr[this.keyIptArr[i]];
                        }
                    break;
                    case 1:     //ㄱ
                        switch(this.keyIptArr[i]){
                            case 9:
                                this.hangulStr03 = 3;
                            break;
                            default:
                                if(this.keyIptArr[i]>18){
                                    this.nextLastHg();
                                    return;
                                }else{
                                    this.next(i);
                                    return;
                                }
                            break;
                        }
                    break;
                    case 3:     //ㄳ
                        if(this.keyIptArr[i]>18){
                            this.nextLastHg();
                            return;
                        }else{
                            this.next(i);
                            return;
                        }
                    break;
                    case 4:     //ㄴ
                        switch(this.keyIptArr[i]){
                        case 12:
                            this.hangulStr03 = 5;
                        break;
                        case 18:
                            this.hangulStr03 = 6;
                        break;
                        default:
                            if(this.keyIptArr[i]>18){
                                this.nextLastHg();
                                return;
                            }else{
                                this.next(i);
                                return;
                            }
                        break;
                        }
                    break;
                    case 8:     //ㄹ
                        switch(this.keyIptArr[i]){
                            case 0:
                                this.hangulStr03 = 9;
                            break;
                            case 6:
                                this.hangulStr03 = 10;
                            break;
                            case 7:
                                this.hangulStr03 = 11;
                            break;
                            case 9:
                                this.hangulStr03 = 12;
                            break;
                            case 16:
                                this.hangulStr03 = 13;
                            break;
                            case 17:
                                this.hangulStr03 = 14;
                            break;
                            case 18:
                                this.hangulStr03 = 15;
                            break;
                            default:
                                if(this.keyIptArr[i]>18){
                                    this.nextLastHg();
                                    return;
                                }else{
                                    this.next(i);
                                    return;
                                }
                            break;
                        }
                    break;
                    case 17:        //ㅂ
                        switch(this.keyIptArr[i]){
                            case 9:
                                this.hangulStr03 = 18;
                            break;
                            default:
                                if(this.keyIptArr[i]>18){
                                    this.nextLastHg();
                                    return;
                                }else{
                                    this.next(i);
                                    return;
                                }
                            break;
                        }
                    break;
                    
                    default:
                        if(this.keyIptArr[i]>18){
                            this.nextLastHg();
                            return;
                        }else{
                            this.next(i);
                            return;
                        }
                    break;
                }
            break;
            }
        }
        this.iptSentence[this.cursorPos] = this.mixHangul();
        this.sentence = this.toStr(this.iptSentence);
        this.init();
    }

    AM.prototype.init = function(){
        this.hangulStr01 = -1;
        this.hangulStr02 = -1;
        this.hangulStr03 = -1;
        this.mixPos = 1;
    }

    AM.prototype.next = function(no){
        var tmp = this.keyIptArr.pop();
        this.init();
        this.mixStr();
        this.init();
        this.cursorPos++;
        this.keyIptArr.splice(0);
        this.keyIptArr.push(tmp);
        this.mixStr();
    }

    AM.prototype.nextLastHg = function(){
        var tmp2 = this.keyIptArr.pop();
        var tmp1 = this.keyIptArr.pop();
        this.init();
        this.mixStr();
        this.init();
        this.cursorPos++;
        this.keyIptArr.splice(0);
        this.keyIptArr.push(tmp1);
        this.keyIptArr.push(tmp2);
        this.mixStr();
    }


    AM.prototype.mixHangul = function(){
        if(this.hangulStr01==-1 && this.hangulStr02==-1 && this.hangulStr03==-1){
            return "";
        }else if(this.hangulStr01==-1 && this.hangulStr03==-1){
            return String.fromCharCode( 12623 + this.hangulStr02);
        }else if(this.hangulStr02==-1 && this.hangulStr03==-1){
            return String.fromCharCode( 12593 + this.hsFstCodeArr[this.hangulStr01]);
        }else if(this.hangulStr01==-1){
            return String.fromCharCode( 44032 + (this.hangulStr02 * 28) + this.hangulStr03);
        }else if(this.hangulStr02==-1){
            return String.fromCharCode( 44032 + (this.hangulStr01 * 588) + this.hangulStr03);
        }else if(this.hangulStr03==-1){
            return String.fromCharCode( 44032 + (this.hangulStr01 * 588) + (this.hangulStr02 * 28));
        }else{
            return String.fromCharCode( 44032 + (this.hangulStr01 * 588) + (this.hangulStr02 * 28) + this.hangulStr03);
        }
    }

    AM.prototype.erase = function(){
        if(this.keyIptArr.length>0){
            this.keyIptArr.pop();
            this.mixStr();
        }else if(this.cursorPos>0){
            this.iptSentence.pop();
            this.cursorPos--;
            this.mixStr();
        }
    }

    AM.prototype.toStr = function(arr){
        var str = "";
        for(var i=0;i<arr.length;i++){
            str+=arr[i];
        }
        return str;
    }


return AM;
});