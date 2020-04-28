import * as data from "../data/positions.json";
import { Location } from "../entity/LocationEntity";
import { Channel } from "../entity/ChannelEntity";
import { CalculatedNode } from "../entity/CalculatedNodeEntity";
import { Dijkstra } from "../libs/dijkstra";
import $ from "jquery";
import lodash from "lodash";

window.onload = (e: any) => {
	let availableNode = data.regions.flatMap(r => r.locations.map(l => l.id));
	const dijkstra = new Dijkstra();
	const a = <HTMLInputElement>document.getElementById("TestBlock");
	if (a != null) {
		a.innerText = "経路計算";
		a.onclick = () => {
			const startId: HTMLInputElement = <HTMLInputElement>document.getElementById("StartId");
			const goalId: HTMLInputElement = <HTMLInputElement>document.getElementById("GoalId");
			const node: CalculatedNode = dijkstra.findNode(startId.value, goalId.value);
			console.log("minRoute: " + node.minRoute.toString());
			console.log("minCost: " + node.minCost);
		}
		const b = <HTMLInputElement>document.getElementById("CalcBlock");
		b.innerText = "最小コストのノード検索";
		b.onclick = () => {
			const startId: HTMLInputElement = <HTMLInputElement>document.getElementById("TargetNodeId");
			availableNode = data.regions.flatMap(r => r.locations.map(l => l.id)).filter(n => n != startId.value);
			const minCostNode: CalculatedNode = dijkstra.calcEachNodes(startId.value, availableNode);
			console.log("minRoute: " + minCostNode.minRoute.toString());
			console.log("minCost: " + minCostNode.minCost);
		}
		const c = <HTMLInputElement>document.getElementById("TopTwoBlock");
		c.innerText = "隣接経路計算";
		c.onclick = () => {
			const startId: HTMLInputElement = <HTMLInputElement>document.getElementById("BeginNodeId");
			const outPutRow: HTMLInputElement = <HTMLInputElement>document.getElementById("OutPutRow");
			const num = parseInt(outPutRow.value) ?? 2;
			const nodes = data.regions.flatMap(r => r.locations.map(l => l.id)).filter(n => n != startId.value);
			const towPwoNodes: CalculatedNode[] = dijkstra.calcTop_N_Nodes(startId.value, nodes, num);
			console.log(towPwoNodes);
		}
	}
	const l = new LocationBuilder();
};

class LocationBuilder {

	// メッセージ区切り文字の設定
	private regionLocationDelimiter!: string;
	private locationDelimiter!: string;
	private locationChannelDelimiter!: string;
	private channelDelimiter!: string;
	private regionJoinDelimiter!: string;

	constructor() {
		this.renewConfig();
		this.copyRegions();
		this.putEvents();
	}

	/**
	 * リージョンの複写
	 */
	private copyRegions() {
		for (let i = 0; i < data.regions.length; i++) {
			$("#Region_-1")
				.clone(true)
				.appendTo("#PositionContent")
				.prop("id", "Region_" + i);
			// 従属要素の属性変更
			$("#Region_" + i + " #RegionName_-1").prop("id", "RegionName_" + i);
			$("#Region_" + i + " #RegionIndex_-1").prop("id", "RegionIndex_" + i);

			// 値の設定
			for (let j = 0; j < data.channels.length; j++) {
				this.copyLocationList(data.channels[j], data.regions[i].locations, i, j);
				$("#Region_" + i).show();
			}
			$("#RegionName_" + i).text(data.regions[i].name);
			$("#RegionIndex_" + i).val(data.regions[i].index);
			$("#RegionName_" + i).show();
		}
	}

	/**
	 * チャンネルの複写
	 * @param channels 
	 * @param targets 
	 * @param regionIndex 
	 * @param locationIndex 
	 */
	private copyLocationList(channels: Channel, locations: Location[], regionIndex: number, locationIndex: number) {
		$("#Location_-1")
			.clone(true)
			.appendTo("#Region_" + regionIndex)
			.prop("id", "Location_" + regionIndex + "_" + locationIndex);
		// 従属要素の属性変更
		$("#Location_" + regionIndex + "_" + locationIndex + " #LocName_-1")
			.prop("id", "LocName_" + regionIndex + "_" + locationIndex);
		$("#Location_" + regionIndex + "_" + locationIndex + " #LocationIndex_-1")
			.prop("id", "LocationIndex_" + regionIndex + "_" + locationIndex);
		$("#Location_" + regionIndex + "_" + locationIndex + " #Choice_-1_-1")
			.prop("id", "Choice_" + regionIndex + "_" + locationIndex + "_-1");

		// 結果の投入
		$("#LocName_" + + regionIndex + "_" + locationIndex).text(channels.name);
		$("#LocationIndex_" + + regionIndex + "_" + locationIndex).val(channels.index);
		this.copyLocationChoices(locations, regionIndex, locationIndex);
		$("#Location_" + + regionIndex + "_" + locationIndex).show();
	}

	/**
	 * 選択肢の複写
	 * @param targets 
	 * @param regionIndex 
	 * @param locationIndex 
	 */
	private copyLocationChoices(locations: Location[], regionIndex: number, locationIndex: number) {
		for (var i = 0; i < locations.length; i++) {
			$("#Choice_" + regionIndex + "_" + locationIndex + "_-1")
				.clone(true)
				.insertBefore("#Choice_" + regionIndex + "_" + locationIndex + "_-1")
				.prop("id", "Choice_" + regionIndex + "_" + locationIndex + "_" + i);
			// 属性変更
			$("#Choice_" + regionIndex + "_" + locationIndex + "_" + i + " #ChoiceRadio_-1_-1")
				.prop("id", "ChoiceRadio_" + regionIndex + "_" + locationIndex + "_" + i);
			$("#ChoiceRadio_" + regionIndex + "_" + locationIndex + "_" + i)
				.prop("name", "ChoiceRadio_" + regionIndex + "_" + locationIndex);

			$("#Choice_" + regionIndex + "_" + locationIndex + "_" + i + " #ChoiceName_-1_-1")
				.prop("id", "ChoiceName_" + regionIndex + "_" + locationIndex + "_" + i);

			// 結果の投入
			$("#ChoiceRadio_" + regionIndex + "_" + locationIndex + "_" + i).val(locations[i].id);
			$("#ChoiceName_" + regionIndex + "_" + locationIndex + "_" + i).text(locations[i].name);
			// 表示
			$("#Choice_" + regionIndex + "_" + locationIndex + "_" + i).show();
		}
	}

	/**
	 * イベントの設定
	 */
	private putEvents() {
		// イベントの挿入
		const radios: HTMLInputElement[] = <HTMLInputElement[]><unknown>document.querySelectorAll("input[id^=ChoiceRadio_");
		radios.forEach(
			l => {
				l.onchange = () => {
					this.buildMessage();
				};
			}
		);
		const configs: HTMLInputElement[] = <HTMLInputElement[]><unknown>document.querySelectorAll("input[type=text][id^=Config]");
		configs.forEach(
			l => {
				l.onchange = () => {
					this.renewConfig();
					this.buildMessage();
				};
			}
		);
		// クリップボードコピー
		$("#ClipBoard").on(
			"click",
			function () {
				let copyText = document.querySelector("#Message");
				if (copyText != null) {
					let range = document.createRange();
					range.selectNodeContents(copyText);

					let selection = window.getSelection();
					if (selection != null) {
						selection.removeAllRanges();
						selection.addRange(range);

						document.execCommand("copy");
					}
				}
			}
		);
		// 設定関係の隠しコマンド
		$(window).keydown(
			function (event) {
				// ctrl + shift
				console.debug(event.ctrlKey + " " + event.shiftKey + "" + event.keyCode);
				if (event.ctrlKey && event.shiftKey && event.keyCode == 67) {
					$("#Config").toggle();
					return false;
				}
			}
		);
	}
	/**
	 * 設定変更
	 */
	private renewConfig() {
		this.regionLocationDelimiter = $("#ConfigRegionLocationDelimiter").val()?.toString() ?? "";
		this.locationDelimiter = $("#ConfigLocationDelimiter").val()?.toString() ?? "";
		this.locationChannelDelimiter = $("#ConfigLocationChannelDelimiter").val()?.toString() ?? "";
		this.channelDelimiter = $("#ConfigChannelDelimiter").val()?.toString() ?? "";
		this.regionJoinDelimiter = $("#ConfigRegionJoinDelimiter").val()?.toString() ?? "";
	}

	/**
	 * メッセージの作成
	 */
	private buildMessage() {
		let regions: RegionMessage[] = [];
		$("input[type=radio][name^=ChoiceRadio_]:checked").each(
			function () {
				/**
				 * リージョンの特定
				 */
				// リージョン
				const regionName: string = <string>$(this).parent().parent().parent().find("div[id^=RegionName_]").text();
				const regionIndex: number = <number>$(this).parent().parent().parent().find("input[id^=RegionIndex_]").val();
				// 処理対象index
				let currentRegionIndex = regions.findIndex(r => r.regionIndex == regionIndex);
				// 既存ノードがない場合は新規のノードを作成して処理中Indexを更新
				if (currentRegionIndex < 0) {
					regions.push(new RegionMessage(regionName, regionIndex));
					currentRegionIndex = regions.length - 1;
				}

				/**
				 * ノードの特定
				 */
				// 対象チャンネル
				const channelIndex: number = <number>$(this).parent().parent().find("input[id^=LocationIndex_]").val();
				// 対象チャンネルのソート順
				const nodeId: string = <string>$(this).parent().find("input[id^=ChoiceRadio_]").val();
				// node index
				const nodeIndex: number = <number>$(this).parent().parent().find("input[id^=LocationIndex_]").val();

				// 取り扱うチャンネルのメッセージ情報
				const targetRegion: NodeInfo[] = regions[currentRegionIndex].nodeInfo;
				// 既存の配列の確認
				const msgIndex = targetRegion.findIndex(r => r.nodeId == nodeId);
				// 選択肢の配列があればメッセージの追記
				if (msgIndex > -1) {
					regions[currentRegionIndex].nodeInfo[msgIndex].channelIndexes.push(channelIndex);
				} else {
					const posInfo = new NodeInfo(nodeId, [channelIndex], nodeIndex);
					regions[currentRegionIndex].nodeInfo.push(posInfo);
				}
			}
		);
		const optMsg = this.optimizeSort(regions);
		$("#Message").text(optMsg);
	}

	/**
	 * ソートしてメッセージを作成
	 * @param regions 
	 */
	private optimizeSort(regions: RegionMessage[]) {
		let messages: string[] = [];
		let targetNodeId: string = "";

		// 前リージョンの最終チャンネル
		let previousRegionChannelIndex = -1;
		// 初回の末端判定
		let isEnd = false;
		
		regions.forEach(r => {
			// リージョン単位で設定する出力メッセージ
			const retMsgs: string[] = [];
			// リージョン内未処理NodeInfo
			let tmpMessages: NodeInfo[] = lodash.cloneDeep(r.nodeInfo);
			// リージョン内末端
			let lastChannelIndex: number = -1;

			// 次の計算 同じregionで未選択 && 近いnode
			while (tmpMessages.length > 0) {
				// メッセージ内で最もchannelIndexの小さいものを取得
				const availableNode = tmpMessages.map(p => p.nodeId);
				targetNodeId = this.findNextNodeId(targetNodeId, availableNode, tmpMessages, previousRegionChannelIndex, isEnd);
				// メッセージ作成処理
				this.buildNodeMessage(tmpMessages, retMsgs, targetNodeId, previousRegionChannelIndex);
				// 末端判定
				isEnd = (tmpMessages.find(n => n.nodeId == targetNodeId)?.nodeIndex == 0 || tmpMessages.find(n => n.nodeId == targetNodeId)?.nodeIndex == r.nodeInfo.length -1);
				// 削除前に直前の最終チャンネルを取得
				lastChannelIndex = tmpMessages.slice(-1)[0].channelIndexes.slice(-1)[0];
				// 処理後の配列を削除
				tmpMessages = tmpMessages.filter(m => m.nodeId != targetNodeId);
			}
			messages.push(r.regionName + this.regionLocationDelimiter + retMsgs.join(this.locationDelimiter));
			// このリージョンの最終チャンネルindex
			previousRegionChannelIndex = lastChannelIndex;
		});
		return messages.join(this.regionJoinDelimiter);
	}

	/**
	 * 次のノードIdを特定
	 * @param previousNodeId 
	 * @param nodes 
	 * @param tmpMessages 
	 * @param lastChannelIndex 
	 * @param isEnd 
	 */
	private findNextNodeId(previousNodeId: string, nodes: string[], tmpMessages: NodeInfo[], lastChannelIndex: number, isEnd: boolean) {
		let nextNodeId = "";
		// 初回の場合は起点計算
		if (previousNodeId == "") {
			return tmpMessages[0].nodeId;
		}
		// N件処理の最適化
		const dijkstra = new Dijkstra();
		// 最初のノードは隣接比較で多いノードを優先
		if (lastChannelIndex == -1) {
			const nextNodes = dijkstra.calcTop_N_Nodes(previousNodeId, nodes, nodes.length);
			// チャンネル数の比較
			switch (nextNodes.length) {
				case 0:
					nextNodeId = nextNodeId;
					break;
				case 1:
					nextNodeId = nextNodes[0].nodeId;
					break;
				default:
					// 末端スタートの場合は無条件で隣接
					if (isEnd){
						nextNodeId = nextNodes[0].nodeId;
					} else {
						const firstChannels: number[] = <number[]>tmpMessages.find(p => p.nodeId == nextNodes[0].nodeId)?.channelIndexes;
						const secondChannels: number[] = <number[]>tmpMessages.find(p => p.nodeId == nextNodes[1].nodeId)?.channelIndexes;
						// 2番目のノードのチャンネル数が多い場合のみ2番目を選択する
						nextNodeId = firstChannels?.length >= secondChannels?.length ? nextNodes[0].nodeId : nextNodes[1].nodeId
					}
					break;
			}
		} else {
			// 同じチャンネルがあればそこ
			const nextChannel: NodeInfo = <NodeInfo>tmpMessages.find(i => i.channelIndexes.indexOf(lastChannelIndex) > -1);
			if (nextChannel != null) {
				nextNodeId = nextChannel.nodeId;
			} else {
				// 隣接検索
				const nextNodes = dijkstra.calcTop_N_Nodes(previousNodeId, nodes, 1);
				nextNodeId = nextNodes[0].nodeId ?? "";
			}
		}
		return nextNodeId;
	}

	/**
	 * メッセージ作成と選択肢の削除
	 * @param tmpMessages 
	 * @param retMsgs 
	 * @param nodeId 
	 * @param lastChannelIndex 
	 */
	private buildNodeMessage(tmpMessages: NodeInfo[], retMsgs: string[], nodeId: string, lastChannelIndex: number) {
		const targetNodeInfo = tmpMessages.find(p => p.nodeId == nodeId) ?? null;
		if (targetNodeInfo == null) {
			return;
		}
		// メッセージ内で最もchannelIndexの小さいものを取得
		let channelIndexes: number[] = targetNodeInfo.channelIndexes ?? [];
		if (lastChannelIndex > -1) {
			// 隣接が端のチャンネルの場合は逆順に並べる
			if (targetNodeInfo.channelIndexes.slice(-1)[0] == lastChannelIndex) {
				channelIndexes = channelIndexes.sort((a, b) => (b - a));
			} else if (channelIndexes.indexOf(lastChannelIndex) > -1) {
				// 直前リージョンのチャンネルがある場合はこれを先頭にする
				channelIndexes = channelIndexes.filter(n => n != lastChannelIndex);
				channelIndexes.unshift(lastChannelIndex);
			}
		}
		// ロケーションとチャンネル名の取得
		let locationName = this.getLocatonName(nodeId) ?? "";
		let channelNames = this.getChannelNames(channelIndexes);
		// nodename + connection-string + channel names[sepalation-string]...
		retMsgs.push(locationName + this.locationChannelDelimiter + channelNames.join(this.channelDelimiter));
	}

	/**
	 * ノードIDからノード名の取得
	 * @param nodeId 
	 */
	private getLocatonName(locationId: string) {
		let regions = data.regions;
		let labels = regions.flatMap(r => r.locations);
		return labels.find(l => l.id == locationId)?.name;
	}
	/**
	 * 複数のチャンネルindexをチャンネル名に変更
	 * @param channelIndexes 
	 */
	private getChannelNames(channelIndexes: number[]) {
		let channelNames: string[] = [];
		for (let i = 0; i < channelIndexes.length; i++) {
			let f = data.channels.find(c => c.index == channelIndexes[i]) ?? new Channel();
			channelNames.push(f.message);
		}
		return channelNames;
	}
}

/**
 * リージョン別メッセージ
 */
class RegionMessage {
	regionName: string;
	regionIndex: number;
	nodeInfo: NodeInfo[];

	constructor(regionName: string, regionIndex: number, nodeInfo: NodeInfo[] = []) {
		this.regionName = regionName;
		this.regionIndex = regionIndex;
		this.nodeInfo = nodeInfo;
	}
}
/**
 * リージョン内チャンネル情報
 */
class NodeInfo {
	// node id
	nodeId: string;
	// チャンネルindex
	channelIndexes: number[];
	// node index
	nodeIndex: number;

	constructor(nodeId: string, channelIndexes: number[], nodeIndex: number) {
		this.nodeId = nodeId;
		this.channelIndexes = channelIndexes;
		this.nodeIndex = nodeIndex;
	}
}
