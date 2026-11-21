/* ============================================================
   场景对话库 · 分场景 / 分程度 / 每板块 50+ 句不重复
   格式：韩语|中文|罗马音|程度(初/中/高)
   ============================================================ */

const SCENE_LIBRARY = {
  '인사 问候寒暄': `
안녕하세요?|你好吗？|annyeonghaseyo|初
안녕히 가세요.|慢走（对离开者）|annyeonghi gaseyo|初
안녕히 계세요.|慢待（对留下者）|annyeonghi gyeseyo|初
오랜만이에요.|好久不见。|oraenmanieyo|初
만나서 반가워요.|很高兴见到你。|mannaseo bangawoyo|初
잘 지냈어요?|过得好吗？|jal jinaesseoyo|初
네, 잘 지냈어요.|嗯，过得很好。|ne, jal jinaesseoyo|初
어떻게 지내셨어요?|您最近怎么样？|eotteoke jinaesyeosseoyo|中
별일 없으셨어요?|没什么事吧？|byeolil eopseusyeosseoyo|中
덕분에 잘 지냈어요.|托您的福，过得很好。|deokbune jal jinaesseoyo|中
요즘 바쁘셨죠?|最近很忙吧？|yojeum bappeusyeotjyo|中
그저 그래요.|就那样吧。|geujeo geuraeyo|初
생각보다 괜찮아요.|比想象中还好。|saenggakboda gwaenchanayo|中
오늘 기분이 좋아요.|今天心情很好。|oneul gibuni joayo|初
기분이 어때요?|心情怎么样？|gibuni eottaeyo|初
피곤해 보여요.|你看起来很累。|pigonhae boyeoyo|中
外貌이 참 예쁘네요.|真漂亮啊。|oemyeoni cham yeppeuneyo|中
오늘 옷 예쁘네요.|今天衣服真好看。|oneul ot yeppeuneyo|初
머리 잘라셨네요.|你剪头发了啊。|meori jallasyeonneyo|中
다이어트 하셨나요?|你减肥了吗？|daieoteu hasyeonnayo|中
마음이 편해요.|心里很踏实。|maeumi pyeonhaeyo|中
뵙게 되어 기뻐요.|很高兴见到您。|boepge doeeo gippeoyo|高
인사가 늦었어요.|失礼了，问候晚了。|insaga neujeosseoyo|高
먼저 인사드렸어야 했는데.|应该我先问候的。|meonjeo insadeuryeoss-eoya haenneunde|高
실례합니다.|打扰了。|sillyehamnida|中
처음 뵙겠습니다.|初次见面。|cheoeum boepgetseumnida|高
잘 부탁드립니다.|请多关照。|jal butakdeurimnida|中
저도 뵙고 싶었어요.|我也正想见您。|jeodo boego sipeosseoyo|高
성함이 어떻게 되세요?|您贵姓？|seonghami eotteoke doeseyo|高
저는 김민지라고 합니다.|我叫金敏智。|jeoneun gimminjirago hamnida|中
어느 회사 다니세요?|您在哪家公司？|eoneu hoesa daniseyo|中
무슨 일 하세요?|您做什么工作？|museun il haseyo|初
한국에 언제 오셨어요?|您什么时候来韩国的？|hanguge eonje o-syeosseoyo|中
한국 생활이 어때요?|韩国生活怎么样？|hanguk saenghwareun eottaeyo|中
적응이 잘 되고 있어요.|适应得挺好的。|jeogeungi jal doego isseoyo|中
말이 많이 늘었어요.|韩语进步了很多。|mari mani neureosseoyo|中
발음이 정확해졌네요.|发音变准确了呢。|bareumi jeonghwakhaejyeonneeyo|高
실력이 늘고 있어요.|实力在提升。|sillyeogi neulgo isseoyo|中
칭찬해 주셔서 감사해요.|谢谢夸奖。|chingchanhae jusyeoseo gamsahaeyo|高
부족한 점이 많아요.|还有很多不足。|bujokhan jeomi manayo|高
앞으로 더 열심히 하겠습니다.|以后会更努力的。|apeuro deo yeolsimhi hagetseumnida|高
잠깐만요.|稍等一下。|jamkkanman-yo|初
잠시만 기다려 주세요.|请稍等。|jamsiman gidaryeo juseyo|中
기다려 주셔서 감사합니다.|谢谢您的等待。|gidaryeo jusyeoseo gamsahamnida|高
먼저 가겠습니다.|我先走了。|meonjeo gagetseumnida|中
조심히 가세요.|小心慢走。|josimhi gaseyo|中
댁까지 잘 가세요.|一路平安到家。|daekkkaji jal gaseyo|高
도착하면 연락 주세요.|到了请联系我。|dochakhamyeon yeollak juseyo|中
네, 연락드릴게요.|好的，我会联系您的。|ne, yeollakdeurilgeyo|中
또 뵙겠습니다.|再见（敬）。|tto boepgetseumnida|高
다음에 또 만나요.|下次再见面。|daeume tto mannayo|初
연락 자주 해요.|经常联系哦。|yeollak jaju haeyo|中
네, 이따 봐요.|好的，回头见。|ne, itta bwayo|初
`.trim(),

  '식당 餐厅点餐': `
여기 주문할게요.|这里点餐。|yeogi jumunhalgeyo|初
메뉴판 좀 주세요.|请给我菜单。|menyupan jom juseyo|初
이거 하나 주세요.|请给我一个这个。|igeo hana juseyo|初
비빔밥 하나 주세요.|请来一份拌饭。|bibimbap hana juseyo|初
불고기 두 인분 주세요.|请来两份烤肉。|bulgogi du inbun juseyo|初
김치찌개 하나 주세요.|请来一份泡菜汤。|gimchijjigae hana juseyo|初
된장찌개 주세요.|请来大酱汤。|doenjangjjigae juseyo|初
물 좀 주세요.|请给我水。|mul jom juseyo|初
반찬 더 주세요.|请再给点小菜。|banchan deo juseyo|中
밥 더 주세요.|请再添饭。|bap deo juseyo|初
맛있어요?|好吃吗？|masisseoyo|初
네, 너무 맛있어요.|嗯，太好吃了。|ne, neomu masisseoyo|初
매운맛 조절해 주세요.|请调整辣度。|maeunmat jojeolhae juseyo|中
덜 맵게 해 주세요.|请做得不那么辣。|deol mapge hae juseyo|中
아주 매워요.|非常辣。|aju maewoyo|初
맛이 어떠세요?|味道怎么样？|masi eottaeseyo|中
입에 맞으세요?|合口味吗？|ibe majeuseyo|高
싱거워요.|有点淡。|singgeowoyo|中
짜요.|有点咸。|jjayo|初
달아요.|有点甜。|darayo|初
시어요.|有点酸。|sieoyo|中
뜨거워요.|很烫。|tteugeowoyo|初
식었어요.|凉了。|sigeosseoyo|中
이건 제가 시킨 게 아닌데요.|这不是我点的。|igeon jega sikin ge anindeoyo|中
주문이 아직 안 나왔어요.|菜还没上。|jumuni ajik an nawaesseoyo|中
얼마나 기다려야 해요?|要等多久？|eolmana gidaryeoya haeyo|中
금방 나올 거예요.|马上就好。|geumbang naol geoyeyo|中
주문 확인 부탁드려요.|麻烦确认一下订单。|jumun hwagin butakdeuryeoyo|高
계산할게요.|结账。|gyesanhalgeyo|初
계산서 주세요.|请给账单。|gyesanseo juseyo|中
카드로 할게요.|刷卡。|kadeuro halgeyo|初
현금으로 할게요.|付现金。|hyeongeumeuro halgeyo|中
현금 영수증 주세요.|请给现金收据。|hyeongeum yeongsujeung juseyo|高
카드 영수증 주세요.|请给刷卡小票。|kadeu yeongsujeung juseyo|中
봉투 주세요.|请给打包盒。|bongtu juseyo|中
포장해 주세요.|请打包。|pojanghae juseyo|中
남은 음식 포장할게요.|剩下的我打包。|nameunumsik pojanghalgeyo|中
잘 먹었습니다.|我吃好了。|jal meogeotseumnida|中
맛있게 먹었습니다.|吃得很香。|masitge meogeotseumnida|高
최고예요!|最棒了！|choegoyeyo|初
추천해 주세요.|请推荐一下。|chucheonhae juseyo|中
이거 추천 메뉴예요?|这个是推荐菜吗？|igeo chucheon menyuyeyo|中
오늘 특별 메뉴가 뭐예요?|今天特色菜是什么？|oneul teukbyeol menyuga mwoyeyo|中
예약했어요.|我预约了。|yeyakhaesseoyo|中
2명 예약했는데요.|预约了两位。|du myeong yeyakaenneundeoyo|中
자리 있나요?|有座位吗？|jari innayo|初
혼자 식사해도 되나요?|一个人可以用餐吗？|honja siksahaedo doennayo|中
금연석 있나요?|有禁烟座吗？|geumyeonseok innayo|中
휠체어 이용 가능한가요?|轮椅可以使用吗？|hwilcheeo iyong ganeunghangayo|高
화장실이 어디예요?|洗手间在哪？|hwajangsiri eodiyeyo|初
식당 분위기가 좋아요.|餐厅气氛很好。|sikdang bunwigiga joayo|中
가격이 좀 비싸요.|价格有点贵。|gagyeogi jom bissayo|中
가성비가 좋아요.|性价比高。|gaseongbiga joayo|高
재방문하고 싶어요.|想再来一次。|jaebangmunhago sipeoyo|高
직원분이 친절해요.|店员很亲切。|jigwonbuni chinjeolhaeyo|中
`.trim(),

  '쇼핑 购物消费': `
이거 얼마예요?|这个多少钱？|igeo eolmayeyo|初
이건 얼마인가요?|这个多少钱？|igeon eolmangayo|中
가격이 어떻게 되나요?|价格是多少？|gagyeogi eotteoke doenayo|中
할인되나요?|打折吗？|harindoenayo|中
특가 상품인가요?|是特价商品吗？|teukga sangpumin-gayo|高
좀 깎아 주세요.|便宜点吧。|jom kkaka juseyo|中
좀 더 할인해 주시겠어요?|能再便宜点吗？|jom deo harinhae jusigesseoyo|高
정가로는 안 되나요?|不能按原价吗？|jeonggaro-neun andoennayo|高
최저가로 주세요.|请给最低价。|choejeogaro juseyo|高
현금으로 하면 더 싸게 해 주시겠어요?|付现金能便宜点吗？|hyeongeumeuro hamyeon deo ssage hae jusigesseoyo|高
이거 입어 봐도 되나요?|这个可以试穿吗？|igeo ibeo bwado doennayo|中
탈의실이 어디예요?|试衣间在哪？|taluksiri eodiyeyo|中
사이즈가 맞나요?|尺寸合适吗？|saijeuga mannayo|中
사이즈가 안 맞아요.|尺寸不合适。|saijeuga an manayo|中
한 사이즈 큰 걸로 주세요.|请给我大一号的。|han saijeu keun geollo juseyo|中
한 사이즈 작은 걸로 주세요.|请给我小一号的。|han saijeu jageun geollo juseyo|中
색깔이 다른 것도 있나요?|有其他颜色吗？|saekkari dareun geotdo innayo|中
다른 색 보여 주세요.|请给我看其他颜色。|dareun saek boyeo juseyo|中
이걸로 할게요.|就买这个。|igeollo halgeyo|初
두 개 주세요.|请给我两个。|du gae juseyo|初
하나만 주세요.|请给我一个。|hanaman juseyo|初
선물용으로 포장해 주세요.|请按礼品包装。|seonmuryongeuro pojanghae juseyo|高
영수증 주세요.|请给收据。|yeongsujeung juseyo|中
교환하고 싶어요.|想换货。|gyohwanhago sipeoyo|中
환불하고 싶어요.|想退货。|hwanbulhago sipeoyo|中
이거 불량이에요.|这个是次品。|igeo bullyang-ieyo|高
새 제품으로 교환 주세요.|请换成新品。|sae jepumeuro gyohwan juseyo|高
다른 걸로 바꿔 주세요.|请给我换别的。|dareun geollo bakkwo juseyo|中
환불 규정이 어떻게 되나요?|退货规定是什么？|hwanbul gyujeongi eotteoke doenayo|高
구매 확인 부탁드려요.|麻烦确认购买。|gumae hwagin butakdeuryeoyo|高
카드로 계산할게요.|刷卡结账。|kadeuro gyesanhalgeyo|初
현금 계산할게요.|现金结账。|hyeongeum gyesanhalgeyo|中
쿠폰이 있나요?|有优惠券吗？|kupon-i innayo|中
쿠폰 사용 가능한가요?|可以使用优惠券吗？|kupon sayong ganeunghangayo|高
포인트 적립되나요?|能积分吗？|pointeu jeokripdoenayo|高
회원가입 해야 하나요?|需要注册会员吗？|hoewon-gaip haeya hanayo|中
이거 유행이에요?|这个流行吗？|igeo yuhaeng-ieyo|中
요즘 인기 있는 상품이에요.|这是最近热门商品。|yojeum ingi inneun sangpumieyo|高
품질이 좋아요.|质量很好。|pumjiri joayo|中
가격 대비 괜찮아요.|价格还可以。|gagyeok daebi gwaenchanayo|高
이거 어디서 만들었어요?|这个在哪生产的？|igeo eodiseo mandeureosseoyo|中
원산지가 어디예요?|产地是哪里？|wonsanjiga eodiyeyo|高
유통기한이 언제까지예요?|保质期到什么时候？|yutonggihani eonjekkajiyeyo|高
단순 변심으로 교환 가능한가요?|单纯不喜欢能换吗？|dansun byeonsimeuro gyohwan ganeunghangayo|高
택배로 보내 주시겠어요?|能快递给我吗？|taekbaero bonae jusigesseoyo|高
배송비는 얼마예요?|运费多少？|baesongbineun eolmayeyo|中
무료 배송되나요?|包邮吗？|muryo baesongdoenayo|中
언제 받을 수 있나요?|什么时候能收到？|eonje badeul su innayo|中
온라인으로 주문할게요.|我在线下单。|onrain-euro jumunhalgeyo|中
매장에서 찾을게요.|我到店取货。|maejang-esoe chajeulgeyo|中
재고가 있나요?|有库存吗？|jaegoga innayo|中
재고 확인 부탁드려요.|麻烦确认库存。|jaego hwagin butakdeuryeoyo|高
이거 사고 싶어요.|我想买这个。|igeo sago sipeoyo|初
고민 좀 해 볼게요.|我再考虑一下。|gomin jom hae bolgeyo|中
`.trim(),

  '교통 交通出行': `
지하철역이 어디예요?|地铁站在哪里？|jihacheollyeogi eodiyeyo|初
가까운 지하철역이 어디인가요?|最近的地铁站在哪？|gakkaun jihacheollyeogi eodin-gayo|中
여기서 지하철 어떻게 타나요?|这里怎么坐地铁？|yeogiseo jihacheol eotteoke tanayo|中
이 버스는 시내로 가나요?|这趟公交去市区吗？|i beoseuneun sineuro ganayo|中
이 버스 어디로 가나요?|这趟公交去哪？|i beoseu eodiro ganayo|中
몇 번 버스를 타야 해요?|该坐几路公交？|myeot beon beoseureul taya haeyo|中
버스 정류장이 어디예요?|公交站在哪？|beoseu jeongnyujangi eodiyeyo|初
여기서 내려 주세요.|请让我在这下车。|yeogiseo naeryeo juseyo|中
다음 정류장에서 내려 주세요.|请在下一站下车。|daeum jeongnyujang-esoe naeryeo juseyo|中
종점까지 가나요?|到终点站吗？|jongjeomkkaji ganayo|中
환승해야 하나요?|需要换乘吗？|hwanseunghaeya hanayo|高
어디서 갈아타나요?|在哪换乘？|eodiseo garatanayo|高
표 한 장 주세요.|请给我一张票。|pyo han jang juseyo|初
지하철표 어디서 사나요?|地铁票在哪买？|jihacheolpyo eodiseo sanayo|中
교통카드 어디서 사요?|交通卡在哪买？|gyotongkadeu eodiseo sayo|中
교통카드 충전하고 싶어요.|想给交通卡充值。|gyotongkadeu chungjeonhago sipeoyo|中
카드 잔액이 얼마예요?|卡里余额多少？|kadeu janaegi eolmayeyo|高
요금이 얼마예요?|车费多少？|yogemi eolmayeyo|中
지하철 요금이 올랐어요?|地铁票价涨了吗？|jihacheol yogemi oreosseoyo|高
막차가 몇 시예요?|末班车几点？|makchaga myeot siyeyo|高
첫차가 몇 시예요?|首班车几点？|cheotchaga myeot siyeyo|高
배차 간격이 얼마나 되나요?|发车间隔多久？|baecha gangyeogi eolmana doenayo|高
지하철이 자주 와요?|地铁班次多吗？|jihacheoli jaju wayo|中
지금 몇 시예요?|现在几点？|jigeum myeot siyeyo|初
길이 막혀요.|堵车了。|giri makkyeoyo|中
교통체증이 심해요.|交通拥堵很严重。|gyotongchejeung-i simhaeyo|高
출근 시간이라 복잡해요.|上班时间所以很拥挤。|chulgeun siganira bokjaphaeyo|中
 택시 불러 주시겠어요?|能帮我叫辆出租车吗？|taeksi bulleo jusigesseoyo|高
택시 타고 갈게요.|我打车去。|taeksi tago galgeyo|中
목적지까지 얼마나 걸려요?|到目的地要多久？|mokjeokjikkaji eolmana geollyeoyo|中
돌아오는 길이 막히면 어쩌죠?|回来堵车怎么办？|doraoneun giri makhimyeon eojjeojo|高
내비게이션 켜 주세요.|请打开导航。|naebigeisyeon kyeo juseyo|中
길 안내 부탁드려요.|麻烦带路。|gil annae butakdeuryeoyo|高
여기서 얼마나 걸려요?|从这里要多久？|yeogiseo eolmana geollyeoyo|中
걸어서 갈 수 있어요?|可以走路去吗？|georeoseo gal su isseoyo|中
걸어서 5분이에요.|走路5分钟。|georeoseo obunieyo|初
자전거로 가는 게 빠를 것 같아요.|骑车去好像更快。|jajeongeoro ganeun ge ppareul geot gatayo|高
기차표 예매하고 싶어요.|想预订火车票。|gichapyeo yemaehago sipeoyo|高
기차역까지 어떻게 가요?|怎么去火车站？|gichayeokkkaji eotteoke gayo|中
KTX 표 있나요?|有KTX票吗？|KTX pyo innayo|中
좌석 예약했어요.|我预约了座位。|jwaseok yeyakhaesseoyo|中
창가 자리 주세요.|请给我靠窗的座位。|changga jari juseyo|中
복도 자리 주세요.|请给我靠过道的座位。|bokdo jari juseyo|中
일등석 얼마예요?|头等舱多少钱？|ildeungseok eolmayeyo|高
일반석으로 주세요.|请给我普通座。|ilbanseogeuro juseyo|中
항공권 확인 부탁드려요.|麻烦确认机票。|hanggonggwon hwagin butakdeuryeoyo|高
탑승구가 어디예요?|登机口在哪？|tapseungguga eodiyeyo|中
수하물 어디에 붙이나요?|行李在哪托运？|suhamul eodie buchinayo|高
수하물 찾는 곳이 어디예요?|行李提取处在哪？|suhamul chatneun gosi eodiyeyo|高
입국 심사 어디로 가나요?|入境审查往哪走？|ipguk simsa eodiro ganayo|高
여권 보여 주세요.|请出示护照。|yeogwon boyeo juseyo|中
비행기가 연착됐어요.|航班延误了。|bihaenggiga yeonchakdoesseoyo|高
비행기가 취소됐어요.|航班取消了。|bihaenggiga chwisodoesseoyo|高
다음 비행기는 언제예요?|下一班飞机什么时候？|daeum bihaenggineun eonjeyeyo|中
공항버스 어디서 타나요?|机场大巴在哪坐？|gonghangbeoseu eodiseo tanayo|中
주차장이 어디예요?|停车场在哪？|juchajangi eodiyeyo|中
주차 요금이 얼마예요?|停车费多少？|jucha yogemi eolmayeyo|中
`.trim(),

  '길찾기 问路指路': `
실례합니다, 길 좀 물어볼게요.|打扰一下，想问个路。|sillyehamnida, gil jom mureobolgeyo|中
여기서 oo역까지 어떻게 가나요?|从这里怎么去oo站？|yeogiseo oo-yeokkkaji eotteoke ganayo|中
이 근처에 지하철역이 있나요?|这附近有地铁站吗？|i geuncheoe jihacheollyeogi innayo|中
가까운 편의점이 어디예요?|最近的便利店在哪？|gakkaun pyeonuijeomi eodiyeyo|中
화장실이 어디에 있어요?|洗手间在哪？|hwajangsiri eodie isseoyo|初
은행이 이 근처에 있나요?|这附近有银行吗？|eunhaengi i geuncheoe innayo|中
약국이 어디예요?|药店在哪？|yakkugi eodiyeyo|初
병원까지 어떻게 가요?|怎么去医院？|byeongwonkkaji eotteoke gayo|中
이 주소로 어떻게 가나요?|这个地址怎么走？|i jusoro eotteoke ganayo|中
여기서 멀어요?|离这里远吗？|yeogiseo meoreoyo|初
걸어서 얼마나 걸려요?|走路要多久？|georeoseo eolmana geollyeoyo|中
버스로 얼마나 걸려요?|坐公交要多久？|beoseuro eolmana geollyeoyo|中
택시로 얼마나 걸려요?|打车要多久？|taeksiro eolmana geollyeoyo|中
지하철로 가는 게 제일 빨라요.|坐地铁最快。|jihacheolro ganeun ge jeil ppallaeyo|中
여기서 직진하세요.|从这里直走。|yeogiseo jikjinhasseoyo|中
쭉 가세요.|一直走。|jjuk gaseyo|初
사거리에서 우회전하세요.|在十字路口右转。|sagorieesoe uhoejeonhasseoyo|中
교차로에서 좌회전하세요.|在路口左转。|gyocharesoe jwhoejeonhasseoyo|中
신호등에서 오른쪽으로 가세요.|在红绿灯处往右走。|sinnodeung-esoe oreunjjogeuro gaseyo|中
왼쪽으로 돌아세요.|请往左转。|oenjjogeuro doraseyo|中
오른쪽에 있어요.|在右边。|oreunjjoge isseoyo|初
왼쪽에 있어요.|在左边。|oenjjoge isseoyo|初
앞에 있어요.|在前面。|ape isseoyo|初
뒤에 있어요.|在后面。|dwie isseoyo|初
건너편에 있어요.|在对面。|geonneopyeone isseoyo|中
모퉁이를 돌면 바로 보여요.|拐过弯就能看到。|motungireul dolmyeon baro boyeoyo|高
골목 안쪽에 있어요.|在小巷里面。|golmok anjjoge isseoyo|中
2층에 있어요.|在二楼。|icheung-e isseoyo|初
지하 1층이에요.|在地下一层。|jiha ilcheung-ieyo|中
엘리베이터 이용해 주세요.|请乘电梯。|ellibeiteo iyonghae juseyo|中
계단으로 올라가세요.|请走楼梯上去。|gyedaneuro ollagaseyo|中
표지판을 따라가세요.|请跟着路标走。|pyojipaneul ttaragaseyo|中
안내판을 보세요.|请看指示牌。|annaepaneul bosseoyo|中
제가 안내해 드릴게요.|我来带您去。|jega annaehae deurilgeyo|高
따라오세요.|请跟我来。|ttaraoseyo|中
잠깐만 기다려 주세요.|请稍等。|jamkkanman gidaryeo juseyo|中
여기가 맞나요?|是这里吗？|yeogiga mannayo|中
여기가 oo역인가요?|这里是oo站吗？|yeogiga oo-yeogingayo|中
이 길이 맞나요?|这条路对吗？|i giri mannayo|中
길을 잘못 든 것 같아요.|好像走错路了。|gireul jalmot deun geot gatayo|高
길을 잃었어요.|我迷路了。|gireul ireosseoyo|中
네비게이션 켜 주시겠어요?|请打开导航好吗？|nebigyeosyeon kyeo jusigesseoyo?|中
지도 보여 주시겠어요?|能给我看看地图吗？|jido boyeo jusigesseoyo|中
여기서 사진 좀 찍어 주시겠어요?|能帮我在这拍张照吗？|yeogiseo sajin jom jjigeo jusigesseoyo|中
이곳이 유명한 관광지인가요?|这里是著名景点吗？|igosi yumyeonghan gwangwangjigungayo|高
여기 볼거리가 많나요?|这里好看的多吗？|yeogi bolgeoriga mannayo|中
추천할 만한 곳이 있나요?|有值得推荐的地方吗？|chucheonhal manhan gosi innayo|高
구경 좀 해 볼게요.|我逛一逛。|gugyeong jom hae bolgeyo|中
사진 명소가 어디예요?|拍照圣地在哪？|sajin myeongso-ga eodiyeyo|高
여기서 기념품 살 만한 곳 있나요?|这有买纪念品的地方吗？|yeogiseo giniyeompum sal manhan gosi innayo|高
감사합니다, 큰 도움이 됐어요.|谢谢，帮了大忙。|gamsahamnida, keun doumi doesseoyo|高
`.trim(),

  '숙박 酒店住宿': `
예약한 방이 있어요.|我预约了房间。|yeyakhan bangi isseoyo|中
예약 확인 부탁드려요.|麻烦确认预约。|yeyak hwagin butakdeuryeoyo|高
이름으로 예약했어요.|用名字预约的。|ireumeuro yeyakhaesseoyo|中
체크인 할게요.|办理入住。|chekeu-in halgeyo|中
체크아웃 할게요.|办理退房。|chekeu-aut halgeyo|中
몇 시에 체크아웃이에요?|几点退房？|myeot sie chekeu-aut-ieyo|中
체크아웃 시간 연장 가능한가요?|退房时间能延长吗？|chekeu-aut sigan yeonjang ganeunghangayo|高
방이 몇 층이에요?|房间在几楼？|bangi myeot cheung-ieyo|中
방 키 주세요.|请给房卡。|bang ki juseyo|中
Wi-Fi 비밀번호가 뭐예요?|WiFi密码是什么？|wi-pi bimilbeonhoga mwoyeyo|中
와이파이가 안 돼요.|WiFi连不上。|waipaiga an dwae-yo|中
조식이 포함돼 있나요?|含早餐吗？|josigi pohamdoe innayo|高
아침 식사 몇 시부터예요?|早餐几点开始？|achim siksa myeot sibuteoyeyo|中
방 청소 부탁드려요.|麻烦打扫房间。|bang cheongso butakdeuryeoyo|中
수건 더 주세요.|请再给毛巾。|sugeon deo juseyo|中
물 더 주세요.|请再给水。|mul deo juseyo|初
냉장고가 안 작동해요.|冰箱不工作。|naengjanggoga an jadonghaeyo|高
에어컨이 고장 났어요.|空调坏了。|e-eokeoni gojang nasseoyo|高
샤워기가 안 나와요.|淋浴不出水。|syaweigiga an nawayo|高
방이 너무 시끄러워요.|房间太吵了。|bangi neomu sikkeureowoyo|中
방을 바꿔 주시겠어요?|能给我换房间吗？|bangeul bakkwo jusigesseoyo|高
조용한 방으로 주세요.|请给我安静的房间。|joyonghan bangeuro juseyo|中
금연 방이 있나요?|有禁烟房吗？|geumyeon bangi innayo|中
흡연이 가능한가요?|可以吸烟吗？|heupyeoni ganeunghangayo|高
방 크기가 어느 정도예요?|房间多大？|bang keugiga eoneu jeongdo-yeyo|高
싱글룸으로 예약했어요.|预约了单人间。|singgeullumeuro yeyakhaesseoyo|中
더블룸으로 바꾸고 싶어요.|想换成双人间。|deobeullumeuro bakkugo sipeoyo|中
1박에 얼마예요?|一晚多少钱？|ilbage eolmayeyo|中
2박 예약했어요.|预约了两晚。|i-bak yeyakhaesseoyo|中
조기 체크인 가능한가요?|可以提前入住吗？|jogi chekeu-in ganeunghangayo|高
짐 좀 맡겨 주시겠어요?|能帮我寄存行李吗？|jim jom matgyeo jusigesseoyo|高
짐 찾으러 왔어요.|来取行李。|jim chajeureo wasseoyo|中
호텔까지 셔틀버스가 있나요?|有酒店接驳车吗？|hotelkkaji syoteulbeoseuga innayo|高
공항까지 얼마나 걸려요?|到机场要多久？|gonghangkkaji eolmana geollyeoyo|中
택시 잡아 주시겠어요?|能帮我拦辆出租车吗？|taeksi jaba jusigesseoyo|高
근처에 맛집 있나요?|附近有美食店吗？|geuncheoe matjip innayo|中
관광 안내 지도가 있나요?|有旅游导览图吗？|gwangwang annae jidoga innayo|高
체크아웃 후 짐 보관 가능한가요?|退房后能寄存行李吗？|chekeu-aut hu jim bogwan ganeunghangayo|高
영수증 부탁드립니다.|请给我收据。|yeongsujeung butakdeurimnida|中
카드로 결제할게요.|刷卡结账。|kadeuro gyeoljehalgeyo|中
현금 결제도 되나요?|也能现金结账吗？|hyeongeum gyeoljedo doenayo|中
보증금이 있나요?|有押金吗？|bojeunggeumi innayo|高
보증금 언제 돌려받나요?|押金什么时候退？|bojeunggeum eonje dollyeobannayo|高
예약 취소하고 싶어요.|想取消预约。|yeyak chwisohago sipeoyo|中
취소 수수료가 있나요?|有取消费吗？|chwiso susuryoga innayo|高
방이 깨끗해요.|房间很干净。|bangi kkaekketaeyo|中
침대가 편해요.|床很舒服。|chimdaega pyeonhaeyo|中
전망이 좋아요.|视野很好。|jeonmangi joayo|中
만족스러운 숙박이었어요.|住宿很满意。|manjokseureoun sukbak-ieosseoyo|高
다음에 또 오고 싶어요.|下次还想来。|daeume tto ogo sipeoyo|中
추천해 주셔서 감사해요.|谢谢推荐。|chucheonhae jusyeoseo gamsahaeyo|高
`.trim(),

  '전화 电话沟通': `
여보세요?|喂？|yeoboseyo|初
네, 여보세요.|喂，您好。|ne, yeoboseyo|初
실례합니다, 바쁘신가요?|打扰了，您忙吗？|sillyehamnida, bappeusingayo|高
누구세요?|您是哪位？|nuguseyo|初
저는 김민지입니다.|我是金敏智。|jeoneun gimminji-imnida|中
oo씨 계세요?|oo先生在吗？|oo-ssi gyeseyo|中
oo씨 좀 바꿔 주세요.|请转接oo先生。|oo-ssi jom bakkwo juseyo|中
잠시만 기다려 주시겠어요?|能稍等一下吗？|jamsiman gidaryeo jusigesseoyo?|中
금방 연결해 드릴게요.|马上为您转接。|geumbang yeongyeolhae deurilgeyo|高
지금 통화 중이에요.|现在正在通话中。|jigeum tonghwa jung-ieyo|中
자리에 없으세요.|不在座位上。|jarie eopseuseyo|中
곧 돌아오실 거예요.|马上就回来。|got dorao-sil geoyeyo|高
메시지 전달해 드릴까요?|要我转达留言吗？|mesiji jeondalhae deurilkka-yo|高
메시지 남겨 주세요.|请留言。|mesiji namgyeo juseyo|中
전화 다시 할게요.|我再打过来。|jeonwa dasi halgeyo|中
번호 다시 알려 주시겠어요?|能再说一遍号码吗？|beonho dasi allyeo jusigesseoyo|高
잘 못 들었어요.|我没听清。|jal mot deureosseoyo|中
좀 더 크게 말씀해 주세요.|请再说大声点。|jom deo keuge malsseumhae juseyo|中
천천히 말씀해 주세요.|请说慢一点。|cheoncheonhi malsseumhae juseyo|中
다시 한 번 말씀해 주시겠어요?|能再说一遍吗？|dasi han beon malsseumhae jusigesseoyo|高
오해하신 것 같아요.|您好像误会了。|ohaehasin geot gatayo|高
제 말은…|我的意思是…|je mareun…|中
이해하셨나요?|您明白了吗？|ihaehasyeonnayo|中
네, 이해했어요.|嗯，明白了。|ne, ihaehaesseoyo|中
문자로 보내 드릴게요.|我发短信给您。|munjaro bonae deurilgeyo|中
문자 확인해 주세요.|请查收短信。|munja hwaginhae juseyo|中
카톡으로 보낼게요.|我用KakaoTalk发。|katogeuro bonaelgeyo|中
이메일로 보내 주시겠어요?|能发邮件给我吗？|imeilleuro bonae jusigesseoyo|高
이메일 주소가 뭐예요?|邮箱地址是什么？|imeil jusoga mwoyeyo|中
전화번호 저장해 두었어요.|我存了您的电话。|jeonhwabeonho jeojanghae dueosseoyo|高
연락처 바꿨어요.|我换号码了。|yeollakcheo bakkwasseoyo|中
새 번호 알려 드릴게요.|告诉您新号码。|sae beonho allyeo deurilgeyo|中
전화가 안 닿아요.|电话打不通。|jeonhaga an daga-yo|中
통화 연결이 안 돼요.|通话连不上。|tonghwa yeongyeoli an dwae-yo|中
신호가 약해요.|信号很弱。|sinoga yakhaeyo|中
여기서 신호가 안 잡혀요.|这里没信号。|yeogiseo sinoga an japhyeoyo|高
전화가 끊겼어요.|电话断了。|jeonhaga kkeun-gyeosseoyo|中
다시 걸게요.|我再拨一次。|dasi geolgeyo|中
발신자 표시가 안 나와요.|不显示来电。|balsinja pyosi an nawayo|高
전화를 받지 않으시네요.|您没接电话。|jeonhwareul batji aneusineyo|高
부재중 전화가 있었어요.|有未接来电。|bujaejung jeonhaga isseosseoyo|中
음성 사서함에 메시지가 있어요.|语音信箱有留言。|eumseong saseoham-e mesigaga isseoyo|高
전화번호 확인 좀 해 주세요.|麻烦确认一下电话号码。|jeonhwabeonho hwagin jom hae juseyo|中
긴급한 일이에요.|是急事。|gin-geuphan iri-eyo|中
급한 일이 생겼어요.|有急事。|geuphan iri saenggyeosseoyo|中
나중에 다시 연락드릴게요.|我稍后再联系您。|najunge dasi yeollakdeurilgeyo|中
지금 통화 가능하신가요?|现在方便通话吗？|jigeum tonghwa ganeunghasin-gayo|高
바쁘시면 나중에 하죠.|您忙的话晚点再说。|bappeusimyeon najunge hajo|高
감사합니다, 좋은 하루 보내세요.|谢谢，祝您一天愉快。|gamsahamnida, joen haru bonaeseyo|高
전화해 주셔서 감사합니다.|谢谢您打电话来。|jeonhwahae jusyeoseo gamsahamnida|高
`.trim(),

  '부탁요청 请求帮助': `
도와주세요!|请帮帮我！|dowajuseyo|初
도와주시겠어요?|能帮我吗？|dowajusigesseoyo|中
부탁드려도 될까요?|可以拜托您吗？|butakdeuryeodo doelkkayo|高
부탁 하나만 드려도 될까요?|能拜托您一件事吗？|butak hanaman deuryeodo doelkkayo|高
실례지만…|不好意思…|sillyejiman|中
죄송하지만…|抱歉…|joesonghajiman|中
사진 좀 찍어 주시겠어요?|能帮我拍张照吗？|sajin jom jjigeo jusigesseoyo|中
이거 좀 들어 주시겠어요?|能帮我拿一下这个吗？|igeo jom deul-eo jusigesseoyo|中
문 좀 열어 주세요.|请开下门。|mun jom yeoreo juseyo|初
문 좀 닫아 주세요.|请关下门。|mun jom dada juseyo|初
창문 좀 닫아 주세요.|请关下窗。|changmun jom dada juseyo|中
불 좀 켜 주세요.|请开下灯。|bul jom kyeo juseyo|中
불 좀 꺼 주세요.|请关下灯。|bul jom kkeo juseyo|中
에어컨 좀 켜 주세요.|请开下空调。|e-eokeon jom kyeo juseyo|中
볼륨 좀 낮춰 주세요.|请调小音量。|boryum jom nachwo juseyo|中
여기 앉아 있어도 되나요?|我可以坐这里吗？|yeogi anja isseodo doennayo|中
이 자리 비었어요?|这个座位有人吗？|i jari bieosseoyo|中
먼저 가도 될까요?|我可以先走吗？|meonjeo gado doelkkayo|高
잠깐만 자리 지켜 주시겠어요?|能帮我看一下座位吗？|jamkkanman jari jikyeo jusigesseoyo|高
펜 좀 빌려 주시겠어요?|能借我支笔吗？|pen jom bilyeo jusigesseoyo|中
지도 좀 보여 주시겠어요?|能给我看看地图吗？|jido jom boyeo jusigesseoyo|中
충전기 좀 빌릴 수 있나요?|能借充电器吗？|chungjeongi jom billil su innayo|中
와이파이 비번 알려 주시겠어요?|能告诉我WiFi密码吗？|waipai bibyeon allyeo jusigesseoyo|中
이거 어떻게 쓰는 건가요?|这个怎么用？|igeo eotteoke sseuneun geongayo|中
좀 가르쳐 주시겠어요?|能教教我吗？|jom gareuchyeo jusigesseoyo|中
한 번 더 보여 주시겠어요?|能再演示一遍吗？|han beon deo boyeo jusigesseoyo|高
혼자 해 볼게요.|我自己试试。|honja hae bolgeyo|中
제가 대신 하겠습니다.|我来做吧。|jega daesin hagetseumnida|高
제가 도와드릴까요?|要我帮忙吗？|jega dowadeurilkkayo|中
필요하시면 말씀해 주세요.|需要的话请告诉我。|piryohasimyeon malsseumhae juseyo|高
괜찮으시면 제가 도와드릴게요.|如果可以我来帮您。|gwaenchansimyeon jega dowadeurilgeyo|高
허락해 주시겠어요?|能允许吗？|heorakhae jusigesseoyo|高
계속해도 되나요?|可以继续吗？|gyesokhaedo doennayo|中
여기서 담배 피워도 되나요?|这里可以吸烟吗？|yeogiseo dambae piwoedo doennayo|中
사진 찍어도 되나요?|可以拍照吗？|sajin jjigeodo doennayo|中
휴대폰 사용해도 되나요?|可以用手机吗？|hyudaepon sayonghaedo doennayo|中
질문해도 될까요?|可以提问吗？|jilmunhaedo doelkkayo|中
한 가지만 더 여쭤볼게요.|再问一个问题。|han gamani deo eojjwo bolgeyo|高
의견 좀 들어 볼게요.|听听您的意见。|uigyeon jom deul-eo bolgeyo|高
제 의견을 말씀드려도 될까요?|可以说下我的意见吗？|je uigyeoneul malsseumdeuryeodo doelkkayo|高
동의하시나요?|您同意吗？|donguihasinayo|中
동의합니다.|我同意。|donguihamnida|中
반대합니다.|我反对。|bandaehamnida|中
고려해 주시겠어요?|能考虑一下吗？|goryeohae jusigesseoyo|高
검토 부탁드립니다.|请审阅。|geomto butakdeurimnida|高
빠르게 처리해 주시겠어요?|能快点处理吗？|ppareuge cheorihae jusigesseoyo|高
오늘 중으로 부탁드려요.|请今天之内办。|oneul jung-euro butakdeuryeoyo|高
기한을 좀 늘려 주시겠어요?|能宽限一点期限吗？|gihaneul jom neullyeo jusigesseoyo|高
정말 감사드립니다.|真的非常感谢。|jeongmal gamsadeurimnida|高
큰 도움이 되었어요.|帮了大忙。|keun doumi doeeosseoyo|高
은혜를 잊지 않겠습니다.|不会忘记您的恩情。|eunhyereul itji angetseumnida|高
`.trim(),

  '날씨계절 天气季节': `
오늘 날씨가 어때요?|今天天气怎么样？|oneul nalssiga eottaeyo|初
날씨가 좋아요.|天气很好。|nalssiga joayo|初
날씨가 나빠요.|天气不好。|nalssiga nappayo|初
맑아요.|晴天。|mang-ayo|初
흐려요.|阴天。|heuryeoyo|初
비가 와요.|下雨了。|biga wayo|初
비가 오나요?|下雨了吗？|biga onayo|初
눈이 와요.|下雪了。|nuni wayo|初
바람이 불어요.|刮风了。|barami bureoyo|中
바람이 세게 불어요.|风刮得很大。|barami sege bureoyo|中
더워요.|热。|deowoyo|初
추워요.|冷。|chuwoyo|初
시원해요.|凉爽。|siwonhaeyo|中
따뜻해요.|暖和。|ttatteutaeyo|中
습해요.|潮湿。|seuphaeyo|中
건조해요.|干燥。|geonjohaeyo|中
쌀쌀해요.|凉飕飕。|ssalssalhaeyo|中
무더워요.|闷热。|mudeowoyo|中
영하로 떨어졌어요.|降到了零下。|yeongharo tteoreojyeosseoyo|高
기온이 몇 도예요?|气温几度？|gioni myeot doyeyo|中
낮에는 덥고 밤에는 추워요.|白天热晚上冷。|najeneun deopgo bameneun chuwoyo|中
일교차가 커요.|温差大。|ilgyocha-ga keoyo|高
내일 날씨 예보가 어때요?|明天天气预报怎么样？|naeil nalssi yeboga eottaeyo|中
비가 올까요?|会下雨吗？|biga olkkayo|中
눈이 올까요?|会下雪吗？|nuni olkkayo|中
오후에 비가 온대요.|说下午有雨。|ohue biga ondaeyo|中
내일은 맑을 거예요.|明天会是晴天。|naeireun malgeul geoyeyo|中
주말에 날씨가 좋대요.|周末天气好。|jumare nalssiga joedaeyo|中
비가 그쳤어요.|雨停了。|biga geuchyeosseoyo|中
눈이 녹고 있어요.|雪在融化。|nuni nokgo isseoyo|高
무지개가 떴어요.|出彩虹了。|mujigaega tteosseoyo|中
번개가 쳤어요.|打雷了。|beongaega chyeosseoyo|中
천둥이 울렸어요.|雷声隆隆。|cheondungi ullyeosseoyo|高
우산 가져가세요.|带把伞吧。|usan gajyeogaseyo|中
우산 잊어버렸어요.|忘带伞了。|usan ijeobeoryeosseoyo|中
비 맞았어요.|淋雨了。|bi majasseoyo|中
감기 걸릴 것 같아요.|好像要感冒。|gamgi geollil geot gatayo|中
옷을 두껍게 입으세요.|穿厚一点。|oseul dukkeopge ibeuseyo|中
모자 쓰고 가세요.|戴帽子去吧。|moja sseugo gaseyo|中
장갑 끼었어요?|戴手套了吗？|janggap kkyeosseoyo|中
외투 입을까요?|要穿外套吗？|oetue ibeulkkayo|中
여름이 제일 좋아요.|我最喜欢夏天。|yeoreumi jeil joayo|初
겨울이 너무 추워요.|冬天太冷。|gyeouri neomu chuwoyo|初
봄이 왔어요.|春天来了。|bomi wasseoyo|初
가을이 끝나가요.|秋天快过去了。|gaeuri kkeutnagayo|中
계절이 바뀌고 있어요.|季节在变换。|gyejeori bakkugo isseoyo|高
환절기라 감기가 많아요.|换季所以感冒多。|hwanjeol-gira gamgiga manayo|高
날씨가 변덕스러워요.|天气多变。|nalssiga byeondeokseureowoyo|高
쾌청한 날씨네요.|晴朗的好天气。|kwaecheonghan nalssineyo|高
비가 와서 기분이 우울해요.|下雨了心情忧郁。|biga waseo gibuni uulhaeyo|中
햇빛이 좋아서 기분이 좋아요.|阳光好心情也好。|haetbiti joaseo gibuni joayo|中
날씨 덕분에 사진이 잘 나왔어요.|托天气的福照片拍得好。|nalssi deokbune sajini jal nawaesseoyo|高
기상청 예보를 확인해 보세요.|查一下气象厅预报吧。|gisangcheong yeboreul hwaginhae bosseoyo|高
`.trim(),

  '감정표현 情感表达': `
기뻐요.|开心。|gippeoyo|初
행복해요.|幸福。|haengbokhaeyo|初
슬퍼요.|伤心。|seulpeoyo|初
화가 나요.|生气。|hwaga nayo|初
놀랐어요.|吓了一跳。|nollasseoyo|中
무서워요.|害怕。|museowoyo|初
걱정돼요.|担心。|geokjeongdwae-yo|中
부끄러워요.|害羞。|bukkeureowoyo|中
미안해요.|对不起。|mianhaeyo|初
고마워요.|谢谢。|gomawoyo|初
사랑해요.|我爱你。|saranghaeyo|初
보고 싶어요.|想你。|bogo sipeoyo|初
그리워요.|想念。|geuriwoyo|中
아쉬워요.|遗憾。|aswowoyo|中
서운해요.|失落。|seounhaeyo|中
속상해요.|难受。|soksanghaeyo|中
답답해요.|憋闷。|dapdaphaeyo|中
우울해요.|忧郁。|uulhaeyo|中
기분이 좋아요.|心情好。|gibuni joayo|初
기분이 나빠요.|心情不好。|gibuni nappayo|初
기분이 상했어요.|心情受影响了。|gibuni sanghaesseoyo|中
기분이 풀렸어요.|心情舒展了。|gibuni pulyeosseoyo|中
스트레스가 쌓여요.|压力堆积。|seuteureseuga ssayeoyo|高
스트레스 해소가 필요해요.|需要解压。|seuteureseo haesoga piryohaeyo|高
긴장이 돼요.|紧张。|ginjangi dwae-yo|中
안심이 돼요.|安心了。|ansimi dwae-yo|中
홀가분해요.|轻松了。|holgabunhaeyo|高
뿌듯해요.|自豪。|ppuduthaeyo|高
자랑스러워요.|骄傲。|jajangseureowoyo|中
감동했어요.|感动了。|gamdonghaesseoyo|中
감사를 느껴요.|感到感谢。|gamsareul neugyeoyo|高
후회돼요.|后悔。|huhoedwae-yo|中
후회하지 않아요.|不后悔。|huhoehaji anayo|中
아무렇지 않아요.|没什么。|amureochi anayo|中
괜찮아요.|没关系。|gwaenchanayo|初
괜찮으세요?|您没事吧？|gwaenchansuseyo|中
이해해요.|我理解。|ihaehaeyo|中
이해가 안 돼요.|不理解。|ihaega an dwae-yo|中
공감해요.|有共鸣。|gonggamhaeyo|高
공감이 안 가요.|无法共鸣。|gonggami an gayo|高
동정해요.|同情。|dongjeonghaeyo|中
안타까워요.|可惜。|antakkawoyo|高
부럽지 않아요.|不羡慕。|bureopji anayo|中
부러워요.|羡慕。|bureowoyo|中
질투가 나요.|嫉妒。|jiltuga nayo|中
의심이 돼요.|怀疑。|uisimi dwae-yo|中
확신이 있어요.|有信心。|hwaksin-i isseoyo|高
자신이 없어요.|没自信。|jashini eopseoyo|中
자신감이 생겼어요.|有自信了。|jasingami saenggyeosseoyo|高
의욕이 생겼어요.|有干劲了。|uiyogi saenggyeosseoyo|高
의욕이 없어요.|没干劲。|uiyogi eopseoyo|中
동기부여가 필요해요.|需要动力。|donggibuyeoga piryohaeyo|高
마음이 복잡해요.|心很乱。|maeumi bokjaphaeyo|中
기분이 한결 편해졌어요.|心情舒畅多了。|gibuni hangyeol pyeonhaejyeoss-eoyo|中
마음이 아파요.|心痛。|maeumi apayo|中
마음이 따뜻해요.|心里温暖。|maeumi ttatteutaeyo|高
마음이통해요.|心意相通。|maeumi tonghaeyo|高
정이 생겼어요.|产生感情了。|jeong-i saenggyeosseoyo|高
정이 떨어졌어요.|感情淡了。|jeong-i tteoreojyeosseoyo|高
`.trim(),

  '학교생활 学校生活': `
오늘 학교에 가요.|今天去学校。|oneul hakgyoe gayo|初
수업이 몇 시에 시작해요?|课几点开始？|sueobi myeot sie sijakhaeyo|中
수업이 끝났어요.|下课了。|sueobi kkeunnasseoyo|中
오늘 수업 어땠어요?|今天课怎么样？|oneul sueop eottaesseoyo|中
숙제가 많아요.|作业很多。|sukjega manayo|初
숙제 다 했어요?|作业都做完了吗？|sukje da haesseoyo|中
숙제 아직 안 했어요.|作业还没做。|sukje ajik an haesseoyo|中
숙제 도와줄래요?|能帮我做作业吗？|sukje dowajullae-yo|中
시험이 언제예요?|考试什么时候？|siheomi eonjeyeyo|初
시험 잘 봤어요?|考得好吗？|siheom jal bwasseoyo|中
시험 망쳤어요.|考砸了。|siheom mangchyeosseoyo|中
합격했어요!|通过了！|hapgyeokhaesseoyo|中
떨어졌어요.|没通过。|tteoreojyeosseoyo|中
성적이 올랐어요.|成绩提高了。|seongjeogi oreosseoyo|中
성적이 떨어졌어요.|成绩下降了。|seongjeogi tteoreojyeosseoyo|中
공부 열심히 해요.|努力学习。|gongbu yeolsimhi haeyo|初
공부가 안 돼요.|学不进去。|gongbuga an dwae-yo|中
집중이 안 돼요.|无法集中。|jipjungi an dwae-yo|中
졸려요.|困。|jollyeoyo|初
지각했어요.|迟到了。|jigakhaesseoyo|中
결석했어요.|缺席了。|gyeolseokhaesseoyo|中
조퇴했어요.|早退了。|jotoehaesseoyo|高
휴학하고 싶어요.|想休学。|hyuhakago sipeoyo|高
전학 갔어요.|转学了。|jeonhak gasseoyo|中
졸업했어요.|毕业了。|joreophaesseoyo|中
졸업식이 언제예요?|毕业典礼什么时候？|joreopsigi eonjeyeyo|中
학교 친구들이 좋아요.|学校朋友们很好。|hakgyo chingudeuri joayo|中
선생님이 친절해요.|老师很亲切。|seonsaengnimi chinjeolhaeyo|中
선생님께 질문할게요.|我要问老师问题。|seonsaengnimkke jilmunhalgeyo|高
모르는 게 있어요.|有不会的。|moreuneun ge isseoyo|中
아직 이해가 잘 안 돼요.|我还不太理解。|ajik ihae ga jal an dwae-yo|中
다시 설명해 주세요.|请再讲解一遍。|dasi seolmyeonghae juseyo|中
질문 있어요.|有问题。|jilmun isseoyo|初
대답해 보세요.|请回答。|daedap-eo bosseoyo|中
정답이 뭐예요?|答案是什么？|jeongdabi mwoyeyo|初
도서관에서 공부해요.|在图书馆学习。|doseogwan-esoe gongbuhayo|中
책을 빌렸어요.|借了书。|chaegeul bilyeosseoyo|中
책을 반납해야 해요.|得还书了。|chaegeul bannap-haeya haeyo|高
노트북 충전해야 해요.|得给笔记本充电。|noteubuk chungjeonhaeya haeyo|高
기숙사에 살아요.|住在宿舍。|gisuksae sarayo|中
기숙사 규칙이 엄격해요.|宿舍规定严格。|gisuksa gyuchigi eomgyeokhaeyo|高
동아리에 가입했어요.|加入了社团。|dongarie gaiphaesseoyo|中
동아리 활동이 재미있어요.|社团活动有趣。|dongari hwaldong-i jaemiisseoyo|中
학생회 선거가 있어요.|有学生会选举。|haksaenghoe seongeo-ga isseoyo|高
장학금을 받고 싶어요.|想拿奖学金。|janghakgeumeul batgo sipeoyo|高
장학금 받았어요!|拿到奖学金了！|janghakgeum badasseoyo|高
진로를 고민하고 있어요.|在烦恼出路。|jinroreul gominhago isseoyo|高
진로 상담을 받고 싶어요.|想做升学就业咨询。|jinro sangdameul batgo sipeoyo|高
대학에 진학하고 싶어요.|想升大学。|daehage jinhaago sipeoyo|高
전공을 정해야 해요.|得定专业。|jeongongeul jeonghaeya haeyo|高
방학이 언제예요?|假期什么时候？|banghagi eonjeyeyo|中
방학 동안 뭐 할 거예요?|假期要做什么？|banghak dongan mwo hal geoyeyo|中
아르바이트 구하고 있어요.|在找兼职。|areubaiteu guhago isseoyo|高
`.trim(),

  '직장생활 职场工作': `
출근 시간이 몇 시예요?|上班几点？|chulgeun sigani myeot siyeyo|中
몇 시에 퇴근하세요?|几点下班？|myeot sie toegeunhaseyo|中
오늘 야근해야 해요.|今天得加班。|oneul yageunhaeya haeyo|高
야근 수당이 있나요?|有加班费吗？|yageun sudangi innayo|高
회의가 언제예요?|会议什么时候？|hoeui-ga eonjeyeyo|中
회의에 참석해야 해요.|得参加会议。|hoeui-e chamseokhaeya haeyo|高
회의실이 어디예요?|会议室在哪？|hoeuisiri eodiyeyo|中
회의 자료 준비됐어요?|会议资料准备好了吗？|hoeui jaryo junbidoesseoyo|高
자료 좀 보내 주시겠어요?|能发资料给我吗？|jaryo jom bonae jusigesseoyo|中
보고서 제출해야 해요.|得交报告。|bogoseo jechulhaeya haeyo|高
기한이 언제까지예요?|期限到什么时候？|gihani eonjekkajiyeyo|高
마감이 급해요.|截止很急。|magami geuphaeyo|中
업무가 많아요.|工作很多。|eopmuga manayo|中
일이 밀렸어요.|工作积压了。|iri millyeosseoyo|高
처리가 다 됐어요.|处理完了。|cheoriga da doesseoyo|中
아직 진행 중이에요.|还在进行中。|ajik jinhaeng jung-ieyo|高
다시 한 번 검토해 주세요.|请再检查一遍。|dasi han beon geomtohae juseyo|高
승인 기다리고 있어요.|在等批准。|seungin gidarigo isseoyo|高
결재 서류 올렸어요.|提交了审批文件。|gyeoljae seoryu ollyeosseoyo|高
업무 인수인계 할게요.|我来做工作交接。|eopmu insu-in-gye halgeyo|高
신입 사원이에요.|我是新员工。|sinip sawon-ieyo|中
면접 본 적이 있어요?|面试过吗？|myeonjeop bon jeogi isseoyo|中
면접 준비하고 있어요.|在准备面试。|myeonjeop junbihago isseoyo|高
이력서 보내 드렸어요.|已发简历。|ilyeokseo bonae deuryeosseoyo|高
채용 공고를 봤어요.|看了招聘公告。|chaeyong gonggoreul bwasseoyo|高
월급이 언제 나와요?|工资什么时候发？|wolgeubi eonje nawayo|中
연봉 협상하고 싶어요.|想谈年薪。|yeonbong hyeopsanghago sipeoyo|高
승진 기회가 있나요?|有晋升机会吗？|seungjin gihoga innayo|高
퇴근 후에 연락 주세요.|下班后联系我。|toegeun hue yeollak juseyo|中
부서가 어디인가요?|在哪个部门？|buseoga eodin-gayo|中
팀장님께 보고드릴게요.|向组长汇报。|timjangnimkke bogodeurilgeyo|高
고객 응대가 힘들어요.|客户应对很累。|gogaek eungdaega himdeureoyo|高
거래처와 미팅이 있어요.|有客户会议。|georae-cheowa miting-i isseoyo|高
출장 가게 되었어요.|要去出差了。|chuljang gage doeeosseoyo|高
출장비 처리해 주세요.|请处理出差费。|chuljangbi cheorihae juseyo|高
경비 정산해야 해요.|得结算费用。|gyeongbi jeongsanhaeya haeyo|高
연차 쓰고 싶어요.|想休年假。|yeoncha sseugo sipeoyo|中
병가를 내야 할 것 같아요.|好像得请病假。|byeonggareul naeya hal geot gatayo|高
휴가 신청서 냈어요.|交了休假申请。|hyuga sincheongseo naesseoyo|高
업무 파악이 필요해요.|需要掌握业务。|eopmu paagi piryohaeyo|高
업무 분장이 어떻게 되나요?|工作怎么分工？|eopmu bunjangi eotteoke doenayo|高
협업이 잘 되고 있어요.|合作顺利。|hyeobeogi jal doego isseoyo|高
소통이 중요해요.|沟通很重要。|sotong-i jungyohaeyo|高
피드백 부탁드립니다.|请给反馈。|pideubaek butakdeurimnida|高
개선할 점이 있나요?|有需要改进的吗？|gaeseonhal jeomi innayo|高
제안서 준비했어요.|准备了提案。|jeanseo junbihaesseoyo|高
계약서 검토 중이에요.|在审核合同。|gye-yakseo geomto jung-ieyo|高
계약이 체결됐어요.|合同签订了。|gye-yagi chegyeoldoesseoyo|高
거래가 성사됐어요.|交易达成了。|georae-ga seongsadoesseoyo|高
실적이 좋아요.|业绩很好。|siljeogi joayo|中
실적이 부진해요.|业绩不佳。|siljeogi bujinhae-yo|高
목표를 달성했어요!|达成目标了！|mokpyoreul dalseonghaesseoyo|高
퇴사하고 싶어요.|想辞职。|toesahago sipeoyo|中
이직 준비하고 있어요.|在准备跳槽。|ijik junbihago isseoyo|高
`.trim(),

  '건강의료 健康医疗': `
건강이 어때요?|身体怎么样？|geongangi eottaeyo|中
건강해요.|很健康。|geonganghaeyo|初
아파요.|疼/生病。|apayo|初
어디가 아파요?|哪里疼？|eodiga apayo|初
머리가 아파요.|头疼。|meoriga apayo|初
배가 아파요.|肚子疼。|baega apayo|初
이가 아파요.|牙疼。|iga apayo|中
목이 아파요.|嗓子疼。|mogi apayo|中
허리가 아파요.|腰疼。|heoriga apayo|中
가슴이 아파요.|胸口疼。|gaseumi apayo|中
감기 걸렸어요.|感冒了。|gamgi geollyeosseoyo|中
기침이 나요.|咳嗽。|gichimi nayo|中
콧물이 나요.|流鼻涕。|konmuri nayo|中
열이 나요.|发烧。|yeori nayo|中
어지러워요.|头晕。|eojireowoyo|中
메스꺼워요.|恶心。|meseukkeowoyo|高
토했어요.|吐了。|tohaesseoyo|中
설사했어요.|拉肚子了。|seolsahaesseoyo|中
변비가 있어요.|便秘。|byeonbiga isseoyo|高
소화가 안 돼요.|不消化。|sohwaga an dwae-yo|中
알레르기가 있어요.|有过敏。|allereugiga isseoyo|高
어디 알레르기예요?|对什么过敏？|eodi allereugiyeyo|高
약을 먹어야 해요.|得吃药。|yageul meogeoya haeyo|中
약국 어디예요?|药店在哪？|yakkug eodiyeyo|初
약 좀 주세요.|请给我药。|yak jom juseyo|初
처방전 있어요.|有处方。|cheobangjeon isseoyo|高
병원에 가야 해요.|得去医院。|byeongwone gaya haeyo|中
예약하고 갔어요.|预约后去的。|yeyakago gasseoyo|中
진료 받고 있어요.|在就诊。|jillyo batgo isseoyo|高
의사 선생님|医生（敬）|uisa seonsaengnim|中
증상을 말씀해 주세요.|请说明症状。|jeungsangeul malsseumhae juseyo|高
언제부터 아팠어요?|什么时候开始疼的？|eonjebuteo apasseoyo|中
이틀 전부터요.|两天前开始。|itteul jeonbuteoyo|中
열 재 볼게요.|量一下体温。|yeol jae bolgeyo|高
혈압 측정하겠습니다.|测血压。|hyeolap cheugjeonghaetseumnida|高
피 검사 해야 해요.|得验血。|pi geomsa haeya haeyo|高
엑스레이 찍어야 해요.|得拍X光。|ekseurei jjigeoya haeyo|高
초음파 검사 받았어요.|做了超声波检查。|choeumpa geomsa badasseoyo|高
진단이 어떻게 나왔어요?|诊断结果怎么样？|jindani eotteoke nawaesseoyo|高
무슨 병인가요?|是什么病？|museun byeong-ingayo|中
큰 병은 아니에요.|不是大病。|keun byeongeun anieyo|中
치료법이 뭐예요?|治疗方法是什么？|chiryobeobi mwoyeyo|高
약을 얼마나 먹어야 해요?|药要吃多久？|yageul eolmana meogeoya haeyo|中
하루에 세 번 드세요.|一天吃三次。|harue se beon deuseyo|中
식후에 드세요.|饭后吃。|sikhu-e deuseyo|中
부작용이 있나요?|有副作用吗？|bujagyong-i innayo|高
부작용이 생기면 연락 주세요.|有副作用请联系我。|bujagyong-i saenggimyeon yeollak juseyo|高
완전히 나으려면 얼마나 걸려요?|完全好要多久？|wanjeonhi naeuryeomyeon eolmana geollyeoyo|高
휴식이 필요해요.|需要休息。|hyusigi piryohaeyo|中
물 많이 드세요.|多喝水。|mul mani deuseyo|中
따뜻하게 입으세요.|穿暖和点。|ttatteuthage ibeuseyo|中
건강검진 받았어요?|体检了吗？|geongang-geomjin badasseoyo|高
정기 검진이 필요해요.|需要定期体检。|jeonggi geomjini piryohaeyo|高
건강 관리를 잘해야 해요.|得好好管理健康。|geongang gwallireul jalhaeya haeyo|高
운동을 시작했어요.|开始运动了。|undongeul sijakhaesseoyo|中
산책이 건강에 좋아요.|散步对健康好。|sanchaeki geongange joayo|中
금연해야 해요.|得戒烟。|geumyeonhaeya haeyo|高
술을 줄여야 해요.|得少喝酒。|sureul juryeoya haeyo|高
수면 부족이에요.|睡眠不足。|sumyeon bujog-ieyo|高
스트레스가 건강에 영향줘요.|压力影响健康。|seuteureseuga geongange yeonghyangjwoyo|高
빠르게 회복되셨으면 좋겠어요.|祝您早日康复。|ppareuge hobokdoesyeosseumyeon jokesseoyo|高
`.trim(),

  '일상대화 日常沟通': `
오늘 뭐 했어요?|今天做什么了？|oneul mwo haesseoyo|初
집에 있었어요.|待在家里了。|jibe isseosseoyo|初
외출했어요.|出门了。|oechulhaesseoyo|中
뭐 먹었어요?|吃什么了？|mwo meogeosseoyo|初
맛있는 거 먹었어요.|吃了好吃的。|masinneun geo meogeosseoyo|中
어디 갔다 왔어요?|去哪回来了？|eodi gatda wasseoyo|中
친구 만났어요.|见朋友了。|chingu mannasseoyo|中
쇼핑했어요.|购物了。|syopinghaesseoyo|中
영화 봤어요.|看电影了。|yeonghwa bwasseoyo|中
요즘 뭐 하세요?|最近在做什么？|yojeum mwo haseyo|中
바쁘게 지내요.|过得忙碌。|bappeuge jinaeyo|中
별일 없어요.|没什么事。|byeolil eopseoyo|初
그냥 쉬었어요.|就休息了。|geunyang swieosseoyo|中
계획이 있어요?|有计划吗？|gyehoegi isseoyo|中
오늘 계획이 뭐예요?|今天计划是什么？|oneul gyehoegi mwoyeyo|中
내일 뭐 할 거예요?|明天要做什么？|naeil mwo hal geoyeyo|初
주말에 뭐 했어요?|周末做什么了？|jumare mwo haesseoyo|中
주말에 뭐 할 거예요?|周末要做什么？|jumare mwo hal geoyeyo|中
약속이 있어요.|有约会。|yaksogi isseoyo|中
약속이 취소됐어요.|约会取消了。|yaksogi chwisodoesseoyo|中
기다리고 있어요.|在等。|gidarigo isseoyo|中
늦었어요.|迟到了。|neujeosseoyo|初
조금 늦을 것 같아요.|可能晚一点。|jogeum neujeul geot gatayo|中
금방 갈게요.|马上就去。|geumbang galgeyo|中
어디 있어요?|在哪？|eodi isseoyo|初
여기 있어요.|在这。|yeogi isseoyo|初
금방 도착할게요.|马上到。|geumbang dochakhalgeyo|中
이거 본 적 있어요?|看过这个吗？|igeo bon jeok isseoyo|中
처음 들어봤어요.|第一次听说。|cheoeum deureobwasseoyo|中
재미있겠네요.|看起来有意思。|jaemiitgetneyo|中
대단하네요.|真厉害。|daedanhaneyo|中
부럽네요.|真羡慕。|bureopneyo|中
어떻게 알았어요?|怎么知道的？|eotteoke alasseoyo|中
그래서요?|所以呢？|geuraeseoyo|中
그런가요?|是吗？|geureongayo|中
정말요?|真的吗？|jeongmaryo|初
진짜요?|真的吗？|jinjjayo|初
농담이에요.|开玩笑的。|nongdam-ieyo|中
진지하게 말하는 거예요?|认真说的吗？|jinjihage malhaneun geoyeyo|高
이해했어요.|明白了。|ihaehaesseoyo|中
모르겠어요.|不知道。|moreugesseoyo|中
생각해 볼게요.|我考虑一下。|saenggak hae bolgeyo|中
결정했어요.|决定了。|gyeoljeonghaesseoyo|中
동의해요.|同意。|donguihaeyo|中
좋은 생각이에요.|好主意。|joen saenggagi-eyo|中
별로 좋지 않아요.|不太好。|byeollo jotji anayo|中
괜찮을까요?|可以吗？|gwaenchalkkayo|中
확실해요?|确定吗？|hwaksilhaeyo|中
가능해요?|可能吗？|ganeunghaeyo|中
불가능해요.|不可能。|bulganeunghaeyo|中
어쩌면요.|也许吧。|eojjeomyeoyo|高
글쎄요.|这个嘛。|geulsse-yo|中
음… 잘 모르겠네요.|嗯…不太清楚。|eum… jal moreugetneyo|中
생각나요?|想起来了吗？|saenggangnayo|中
맞아요!|对！|majayo|初
아니요, 틀렸어요.|不，错了。|aniyo, teullieosseoyo|中
아, 그렇군요.|啊，这样啊。|a, geureokgunyo|中
와, 정말 놀랐어요.|哇，真吓了一跳。|wa, jeongmal nollasseoyo|中
이야기 좀 더 해 주세요.|再多说一点。|iyagi jom deo hae juseyo|中
잘 듣고 있어요.|我在认真听。|jal deutdgo isseoyo|中
고마운 말이에요.|谢谢你说这话。|gomaun marieyo|高
`.trim(),

  '아이돌과 대화 偶像互动': `
안녕하세요! 팬이에요.|你好！我是粉丝。|annyeonghaseyo! paenieyo|初
너무 좋아해요!|太喜欢你了！|neomu joahaeyo|初
사인 부탁드려요.|请给我签个名。|sain butakdeuryeoyo|初
사진 같이 찍어도 돼요?|可以一起合影吗？|sajin gachi jjigeodo dwaeyo|初
오빠, 화이팅!|哥哥，加油！|oppa, hwaiting|初
정말 멋있어요!|真的很帅！|jeongmal meosisseoyo|初
노래 잘 불렀어요.|歌唱得很好。|norae jal bulleosseoyo|初
팬레터 썼어요.|我写了粉丝信。|paenteuleo sseosseoyo|初
처음 뵙겠어요.|初次见面。|cheoeum boepgeseoyo|初
중국에서 왔어요.|我从中国来。|junggugeseo wasseoyo|初
이름이 뭐예요?|你叫什么名字？|ireumi mwoyeyo|初
오늘 정말 예뻐요.|今天真漂亮。|oneul jeongmal yeppeoyo|初
감사합니다!|谢谢！|gamsahamnida|初
잘 부탁드려요.|请多多关照。|jal butakdeuryeoyo|初
오빠의 노래를 매일 들어요.|我每天听哥哥的歌。|oppaui noraereul maeil deureoyo|中
앨범 다 샀어요.|专辑全买了。|aelbeom da sasesseoyo|中
컴백 진심으로 축하해요.|衷心祝贺你回归。|keombaek jinsimeuro chukhahaeyo|中
이번 무대 정말 대박이었어요.|这次舞台真的很棒。|ibeon mudae jeongmal daebagiesseoyo|中
덕질하면서 행복해요.|追星的同时很幸福。|deokjilhamyeonseo haengbokaeyo|中
응원봉을 들고 왔어요.|我拿着应援棒来了。|eungwonbongeul deulgo wasseoyo|中
사인회에서 만나서 반가워요.|在签名会上见到很高兴。|sainhoeeseo mannaseo bangawoyo|中
콘서트 티켓 예매했어요.|我预购了演唱会门票。|konseonteu tiket yemaehaesseoyo|中
최애가 드디어 왔네요.|本命终于来了。|choeaega deudieo wanneyo|中
포토카드 한 장만 주세요.|请给我一张小卡。|potokadeu han jangman juseyo|中
목소리가 정말 좋아요.|声音真的很好听。|moksoriga jeongmal joayo|中
안무 연습 많이 했어요.|编舞练习了很多次。|anmu yeonseup mani haesseoyo|中
팬클럽 가입했어요.|我加入了粉丝俱乐部。|paenkeulleop gaiphaesseoyo|中
신곡 벌써 다 외웠어요.|新歌已经全背下来了。|singok beolsseo da oeulsseoyo|中
오빠를 향한 마음을 어떻게 전할까요?|该怎样传达我的心意呢？|oppareul hyanghan maeumeul eotteoke jeonhalkkayo|高
늘 응원한다는 걸 알아주세요.|请知道我一直都在支持你。|neul eungwonhandaneun geor arajuseyo|高
성덕이 돼서 정말 영광이에요.|能成功追星真的很荣幸。|seongdeogi dwae seo jeongmal yeonggwangieyo|高
팬덤의 힘을 보여주고 싶어요.|想展示粉丝群体的力量。|paendeamui himeul boyeojugo sipeoyo|高
음원차트 1위를 기원해요.|祝愿拿下音源榜第一。|eumwonchateu iwireul giwonhaeyo|高
오빠의 성장을 곁에서 지켜볼게요.|我会在身边见证你的成长。|oppaui seongjangeul gyeoteseo jikyeobolgeyo|高
팬으로서 자부심을 느껴요.|作为粉丝感到自豪。|paeneuroseo jabusimeul neukkyeoyo|高
이번 컴백이 인생 최고예요.|这次回归是人生最佳。|ibeon keombaegi insaeng choegoyeyo|高
언제까지나 변함없이 좋아할게요.|我会一直不变地喜欢你。|eonjekkajina byeonhameopsi joahalgeyo|高
무대 위의 오빠가 자랑스러워요.|舞台上的哥哥让我骄傲。|mudae wiu oppaga jaranseureowoyo|高
`.trim(),

  '동덕과 수다 同担交流': `
너도 이 그룹 좋아해?|你也喜欢这个组合吗？|neodo i geurup joahae|初
나 최애 있어요.|我有本命。|na choeae isseoyo|初
같이 덕질하자.|一起追星吧。|gachi deokjilhaja|初
이 노래 들어봤어?|听过这首歌吗？|i norae deureoboss-eo|初
진짜 예쁘지 않아?|是不是真的很漂亮？|jinjja yeppeuji ana|初
내 최애는 리더야.|我的本命是队长。|nae choeaeneun rideoya|初
포토카드 교환하자.|我们交换小卡吧。|potokadeu gyohanhaja|初
콘서트 같이 갈래?|要一起去演唱会吗？|konseonteu gachi gallae|初
나도 입덕했어.|我也入坑了。|nado ipdeokhaesseo|初
우리 취향 같네요.|我们喜好一样呢。|uri chwihyang gatneyo|初
응원봉 색깔 뭐예요?|应援棒是什么颜色？|eungwonbong saekkari mwoyeyo|初
굿즈 많이 샀어요.|买了很多周边。|gujeu mani sasesseoyo|初
드디어 동덕을 만났네요.|终于遇到同担了。|deudieo dongdeogeul mannanne yo|中
취향이 완전 같아요.|喜好完全一样。|chwihyangi wanjeon gatayo|中
이 앨범 수록곡 다 명곡이에요.|这张专辑收录曲全是名曲。|i aelbeom surokgok da myeonggogieyo|中
컴백 무대 같이 봤어요?|一起看了回归舞台吗？|keombaek mudae gachi bwasseoyo|中
직캠 하나 추천해 주세요.|请推荐一个直拍。|jikaem hana chucheonhae juseyo|中
굿즈 정말 갖고 싶어요.|周边真的很想要。|gujeu jeongmal gatgo sipeoyo|中
팬미팅 신청했어?|申请粉丝见面会了吗？|paenmiting sincheonghaesseo|中
차애도 생겼어요.|也有第二喜欢的了。|chaae-do saenggyeosseoyo|中
가사 외우느라 밤새웠어요.|背歌词背到熬夜。|gasa oeuneura bamsaewosseoyo|中
덕질하다가 시간 가는 줄 몰랐어요.|追星都忘了时间。|deokjilhada ga sigan ganeun jul mollasseoyo|中
최애 생일 선물 준비했어요?|准备本命的生日礼物了吗？|choeae saengil seonmul junbihaesseoyo|中
오늘 스밍 완료했어요.|今天刷音源完成了。|oneul seuming wanlyohaesseoyo|中
덕질이 삶의 활력소예요.|追星是生活的活力源泉。|deokjiri samui hwallyeksovieyo|高
팬덤 간의 의견 차이가 있더라고요.|粉丝间存在意见分歧呢。|paendeam ganui uigyeon chaga isseodeoragoyo|高
입덕 계기를 공유하고 싶어요.|想分享入坑的契机。|ipdeok gyegireul gongyuhago sipeoyo|高
성덕 후기가 부러워요.|好羡慕成功追星的分享。|seongdeok hugiga beureowoyo|高
탈덕 고민을 한 적이 있어요.|曾经纠结过要不要脱粉。|taldeok gomineul han jeogi isseoyo|高
같은 덕후끼리 통하는 게 있죠.|同担之间有相通的东西吧。|gateun deokhukkiri tonghaneun ge ijyo|高
덕질비가 만만치 않아요.|追星的花费可不少。|deokjilbiga manmanchi anayo|高
오래도록 함께 덕질해요.|长久地一起追星吧。|oraedorok hamkke deokjilhayo|高
팬으로서의 마음을 이해해 주세요.|请理解作为粉丝的心。|paeneuroseoui maeumeul ihaehae juseyo|高
최애가 행복하면 저도 행복해요.|本命幸福我也就幸福。|choeaega haengbokhamyeon jeodo haengbokaeyo|高
`.trim(),

  '덕질 일상 追星日常': `
오늘 음원 들었어요.|今天听了音源。|oneul eumwon deureosseoyo|初
새 뮤비 봤어요.|看了新MV。|sae myubi bwasseoyo|初
노래 연습하고 있어요.|正在练习唱歌。|norae yeonseuphago isseoyo|初
안무 따라 했어요.|跟着跳了编舞。|anmu ttara haesseoyo|初
가사 공부해요.|学习歌词。|gasa gongbuhae yo|初
포스터 붙였어요.|贴了海报。|poseuteo buttyeosseoyo|初
스티커 모아요.|收集贴纸。|seutikeo moayo|初
사진 많이 찍었어요.|拍了很多照片。|sajin mani jjigeosseoyo|初
응원가 불렀어요.|唱了应援歌。|eungwonga bulleosseoyo|初
화보 봤어요.|看了画报。|hwabo bwasseoyo|初
오늘도 스밍 했어요.|今天也刷音源了。|oneuldo seuming haesseoyo|初
매일 스트리밍하고 있어요.|每天都在刷音源。|maeil seuteuriminghago isseoyo|中
신곡 발매 소식 들었어요?|听说新歌发行的消息了吗？|singok balmae sosik deureosseoyo|中
미니앨범 예약했어요.|预订了迷你专辑。|miniaelbeom yeyakhaesseoyo|中
리허설 영상 봤어요.|看了彩排视频。|riheosol yeongsang bwasseoyo|中
앵콜 무대 놓쳤어요.|错过了安可舞台。|aengkol mudae nochyeosseoyo|中
소속사 공식 입장 나왔어요.|经纪公司发布了官方立场。|sosoksa gongsik ipjang nawasseoyo|中
음반이 도착했어요.|唱片到了。|eumbani dochakhaesseoyo|中
솔로 활동 응원해요.|支持个人活动。|solo hwaldong eungwonhaeyo|中
유닛 무대 기대돼요.|期待小分队舞台。|yunit mudae gidaedwae yo|中
팬페이지에서 소식 확인했어요.|在粉丝页确认了消息。|paenpeijieseo sosik hwaginhaesseoyo|中
오늘 티켓 예매 성공했어요!|今天抢票成功了！|oneul tiket yemae seonggonghaesseoyo|中
포토카드 정리했어요.|整理了小卡。|potokadeu jeongnihaesseoyo|中
음원차트 순위가 올라갔어요.|音源榜排名上升了。|eumwonchateu sunwiga ollagasseoyo|高
컴백 준비가 한창이에요.|回归准备正如火如荼。|keombaek junbiga hanchangieyo|高
데뷔 무대가 아직도 생생해요.|出道舞台至今仍历历在目。|debi mudae ga ajikdo saengsaenghaeyo|高
팬들의 힘으로 1위를 했어요.|靠粉丝的力量拿了第一。|pandeurui himeuro iwireul haesseoyo|高
리패키지 앨범도 기대돼요.|也期待改版专辑。|ripakeji aelbeomdo gidaedwae yo|高
자료 정리하다가 시간 다 보냈어요.|整理资料花光了时间。|jaryo jeongnihadaga sigan da bonaesseoyo|高
덕질도 일상처럼 자리 잡았어요.|追星也像日常一样扎根了。|deokjildo ilsangcheoreom jari jabasseoyo|高
예능 출연 소식에 기뻐요.|因综艺出演的消息而高兴。|yeneung chulyeon sosie gippeoyo|高
성장하는 모습을 지켜보는 게 즐거워요.|看着成长的样子很快乐。|seongjanghaneun moseubeul jikyeoboneun ge jeulgeowoyo|高
변함없는 마음으로 응원할게요.|会以不变的心支持你。|byeonhameomneun maeumeuro eungwonhalgeyo|高
`.trim()
};
