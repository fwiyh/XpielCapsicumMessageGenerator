$(function(){

	var dataPath = "./content.json";
	var contents = readContents(dataPath);

	$("#Message").val("");

	// 設定関係
	var connectionString = "";
	var separationString = "";
	var joinString = "";
	// 初期設定の取得
	renewConfig();

	// 選択肢
	var choices = contents["choices"];
	// チャンネル
	var area = contents["area"];

	// エリアの設定
	for (var i = 0; i < area.length; i++){
		copyLocationList(area[i], choices, i);
	}

	// イベントの挿入
	$("input[type=radio][id^=ChoiceRadio_]").on(
		"change",
		function(){
			buildMessage();
		}
	)
	$("#Config input[type=text][id^=Config]").on(
		"change",
		function(){
			renewConfig();
			buildMessage();
		}
	)

	// クリップボードコピー
	$("#ClipBoard").on(
		"click",
		function(){
			var copyText = document.querySelector("#Message"); 

			var range = document.createRange();
			range.selectNodeContents(copyText);
		
			var selection = window.getSelection();
			selection.removeAllRanges();
			selection.addRange(range);
		
			document.execCommand("copy");
		}
	);

	// 設定関係の隠しコマンド
	$(window).keydown(
		function(event){
			// ctrl + shift
			console.log(event.ctrlKey + " " + event.shiftKey  + "" + event.keyCode);
			if (event.ctrlKey && event.shiftKey && event.keyCode == 67){
				$("#Config").toggle();
				return false;
			}
		}
	);

	/**
	 * ロケーションの複写
	 * @param {*} resource 
	 */
	function copyLocationList(resource, choices, count){
		$("#Location_-1")
			.clone(true)
			.appendTo("#PositionContent")
			.prop("id", "Location_" + count);
		// 従属要素の属性変更
		$("#Location_" + count + " #LocName_-1").prop("id", "LocName_" + count);
		$("#Location_" + count + " #Message_-1").prop("id", "Message_" + count);
		$("#Location_" + count + " #LocationIndex_-1").prop("id", "LocationIndex_" + count);
		$("#Location_" + count + " #Choice_-1_-1").prop("id", "Choice_" + count + "_-1");

		// 結果の投入
		$("#LocName_" + count).text(resource.name);
		$("#Message_" + count).val(resource.message);
		$("#LocationIndex_" + count).val(resource.index);
		copyLocationChoices(choices, count);
		$("#Location_" + count).show();
	}

	/**
	 * 選択肢の複写
	 * @param {*} choices 
	 */
	function copyLocationChoices(choices, count){
		for (var i = 0; i < choices.length; i++){
			$("#Choice_" + count + "_-1")
				.clone(true)
				.insertBefore("#Choice_" + count + "_-1")
				.prop("id", "Choice_" + count + "_" + i);
			// 属性変更
			$("#Choice_" + count + "_" + i + " #ChoiceRadio_-1_-1").prop("id", "ChoiceRadio_" + count + "_" + i);
			$("#ChoiceRadio_" + count + "_" + i).prop("name", "ChoiceRadio_" + count);

			$("#Choice_" + count + "_" + i + " #ChoiceIndex_-1_-1").prop("id", "ChoiceIndex_" + count + "_" + i);
			$("#Choice_" + count + "_" + i + " #ChoiceName_-1_-1").prop("id", "ChoiceName_" + count + "_" + i);

			// 結果の投入
			$("#ChoiceRadio_" + count + "_" + i).val(choices[i].id);
			$("#ChoiceIndex_" + count + "_" + i).val(choices[i].index);
			$("#ChoiceName_" + count + "_" + i).text(choices[i].name);
			// 表示
			$("#Choice_" + count + "_" + i).show();
		}
	}

	/**
	 * コンテンツの読み込み
	 * @param {uri} dataPath 
	 */
	function readContents(dataPath){
		var ret = [];
		$.ajax({
			async: false,
			cache: false,
			dataType: "json",
			url: dataPath,
			data: {}
		})
		.done(
			function(data){
				ret = data;
			}
		).always(
			function(){
			}
		);
		return ret;
	}

	/**
	 * メッセージの作成
	 * TODO 並べ替えの後に文字列作成
	 */
	function buildMessage(){
		var msgArr = [];
		$("input[type=radio][name^=ChoiceRadio_]:checked").each(
			function(){
				// 対象チャンネル
				var targetArea = $(this).parent().parent().find("input[id^=Message_]").val();
				// 対象チャンネルのソート順
				var locationIndex = $(this).parent().parent().find("input[id^=LocationIndex_]").val();
				// 選択肢のindex
				var selectedIndex = $(this).parent().find("input[id^=ChoiceIndex_]").val();
				// 選択肢の名称
				var selectedName = $(this).parent().find("span[id^=ChoiceName_]").text();

				// 既存の配列の確認
				var msgIndex = msgArr.findIndex(
					function(element, index, array){
						return (element.selectedIndex === selectedIndex);
					}
				);
				// 選択肢の配列があればメッセージの追記
				if (msgIndex > -1){
					if (msgArr[msgIndex].index > locationIndex){
						msgArr[msgIndex].index = locationIndex;
					}
					msgArr[msgIndex].messages.push(targetArea);
				}else {
					var posInfo = [];
					// チャンネル名
					posInfo.index = locationIndex;
					// 選択肢情報
					posInfo.selectedIndex = selectedIndex;
					// 場所
					posInfo.selectedName = selectedName;
					// チャンネル名
					posInfo.messages = [];
					posInfo.messages.push(targetArea);
					// 配列追加
					msgArr.push(posInfo);
				}
			}
		);
		var optMsg = optimizeSort(msgArr);
		var viewMessage = optMsg.join(joinString);
		$("#Message").text(viewMessage);
	}

	/**
	 * 並べ替え
	 * 理想なら座標で判断したい
	 * @param {*} msgArr 
	 * @param {*} choices 
	 */
	function optimizeSort(msgArr){
		var tmpArr = msgArr;
		// 選択肢のindex値の最小値
		// var firstIndex = choices[0].index;
		var firstIndex = Math.min.apply(null, choices.map(function(a){return a.index;}));
		// 選択肢のindex値の最大値
		// var lastIndex = choices[choices.length-1].index;
		var lastIndex = Math.max.apply(null, choices.map(function(a){return a.index;}));
		if (tmpArr.length > 0){
			var firstPos = tmpArr[0].selectedIndex;
			// 先頭からのスタート
			if (firstIndex == firstPos){
				tmpArr.sort(
					function (a, b){
						if(a.selectedIndex < b.selectedIndex) return -1;
						if(a.selectedIndex > b.selectedIndex) return 1;
						return 0;
					}
				);
			}else if (lastIndex == firstPos){
				// 最後からのスタート
				tmpArr.sort (
					function(a, b){
						if(a.selectedIndex > b.selectedIndex) return -1;
						if(a.selectedIndex < b.selectedIndex) return 1;
						return 0;
					}
				);
			}else {
				// 真ん中スタートの場合、隣が近いものを選ぶ
				// スタートの選択肢の配列番号
				var currentIndex = tmpArr[0].selectedIndex;
				// スタートの配列番号から次のindexの配列番号
				var nextIndexObj = choices.filter(
					function(item, index){
						return (item.index == currentIndex);
					}
				);

				// 最も近い場所のindex値
				var nextIndex = -1;
				if (nextIndexObj.length > 0){
					nextIndex = nextIndexObj[0].next;
				}

				var sortedArr = [];
				// 先頭の追加
				sortedArr.push(tmpArr[0]);
				// 真ん中のselectedIndex
				var beginSelectedIndex = parseInt(tmpArr[0].selectedIndex);

				// 上のメッセージ
				var upperMessages = tmpArr.filter(
					function(item, index){
						return (item.selectedIndex == parseInt(beginSelectedIndex-1));
					}
				);
				// 下のメッセージ
				var lowerMessages = tmpArr.filter(
					function(item, index){
						return (item.selectedIndex == parseInt(beginSelectedIndex+1));
					}
				);

				// メッセージ長の取得
				var upperMessageLength = 0;
				if (upperMessages.length > 0){
					upperMessageLength = upperMessages[0].messages.length;
				}
				var lowerMessageLength = 0;
				if (lowerMessages.length > 0){
					lowerMessageLength = lowerMessages[0].messages.length;
				}

				// TODO ２次元軸で評価する場合はいつか検討
				// TODO この辺の処理を綺麗にしたい
				// 隣接が同数の場合は近い方に向かう
				if (upperMessageLength == lowerMessageLength){
					if (nextIndex == upperMessages[0].selectedIndex){
						// 上
						sortedArr = sortedArr.concat(getToUpper(tmpArr, beginSelectedIndex));
						// 下
						sortedArr = sortedArr.concat(getToLower(tmpArr, beginSelectedIndex, lastIndex));
					}else {
						// 下
						sortedArr = sortedArr.concat(getToLower(tmpArr, beginSelectedIndex, lastIndex));
						// 上
						sortedArr = sortedArr.concat(getToUpper(tmpArr, beginSelectedIndex));
					}
				}else if (upperMessageLength > lowerMessageLength){
					// 上
					sortedArr = sortedArr.concat(getToUpper(tmpArr, beginSelectedIndex));
					// 下
					sortedArr = sortedArr.concat(getToLower(tmpArr, beginSelectedIndex, lastIndex));	
				}else {
					// 下
					sortedArr = sortedArr.concat(getToLower(tmpArr, beginSelectedIndex, lastIndex));
					// 上
					sortedArr = sortedArr.concat(getToUpper(tmpArr, beginSelectedIndex));
				}
				tmpArr = sortedArr;
			}
		}
		var optArr = [];
		for (var i = 0; i < tmpArr.length; i++){
			optArr.push(tmpArr[i].selectedName + connectionString + tmpArr[i].messages.join(separationString));
		}
		return optArr;
	}

	/**
	 * 上方向への挿入
	 * @param {*} tmpArr 
	 * @param {*} beginSelectedIndex 
	 */
	function getToUpper(tmpArr, beginSelectedIndex){
		var sortedArr = [];
		for (var i = beginSelectedIndex - 1; i > 0; i--){
			var addMsg = tmpArr.filter(
				function(item, index){
					return (item.selectedIndex == i);
				}
			);
			if (addMsg.length > 0){
				sortedArr.push(addMsg[0]);
			}
		}
		return sortedArr;
	}

	/**
	 * 下方向への挿入
	 * @param {*} tmpArr 
	 * @param {*} beginSelectedIndex 
	 */
	function getToLower(tmpArr, beginSelectedIndex, lastIndex){
		var sortedArr = [];
		for (var i = beginSelectedIndex + 1; i <= lastIndex + 1; i++){
			var addMsg = tmpArr.filter(
				function(item, index){
					return (item.selectedIndex == i);
				}
			);
			if (addMsg.length > 0){
				sortedArr.push(addMsg[0]);
			}
		}
		return sortedArr;
	}

	/**
	 * 設定変更
	 */
	function renewConfig(){
		connectionString = $("#ConfigConnectionString").val();
		separationString = $("#ConfigSepalationString").val();
		joinString = $("#ConfigJoinString").val();
	}
});