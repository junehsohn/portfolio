$ =>
  body_view = new BodyView()

  new Router()

  # pushStateするためには、サーバ側対応が必要
  Backbone.history.start(pushState: true)
  # Backbone.history.start()

# 全体のルーティングを行う
Router = Backbone.Router.extend
  # Singletonパターン
  # 通常、色々なイベントで遷移するため、Singletonに
  constructor: ->
    if !Router.instance
      Router.instance = @
      Backbone.Router.apply(Router.instance, arguments)
    Router.instance

  # どこにアクセスされたら、どの関数を呼ぶか定義
  routes:
    "": "index"
    "other": "other"
    "other/:id": "other"

  # ------------------------------------------
  # 対応するビュークラスを生成し表示処理を呼ぶ
  # ------------------------------------------

  index: ->
    @index_view = new IndexView() unless @index_view
    @index_view.render()

  other: (id) ->
    @other_view = new OtherView() unless @other_view
    @other_view.render(id: id)

# body要素ビュー。全体のリンク処理を扱う
BodyView = Backbone.View.extend
  el: 'body'

  # class="link"な要素がクリックされたらlink関数を呼ぶように
  events:
    "click .link": "link"

  # 通常のリンクによる遷移をキャンセルし、Backbone.Routerによる遷移を行う
  link: (e) ->
    e.preventDefault()
    (new Router()).navigate($(e.target).attr("href"), trigger: true)

# 各ページ用ビューの抽象クラス
PageViewBase = Backbone.View.extend
  el: '#app_view'

  # テンプレートが書かれているscriptタグのid名
  # 上書きを想定
  template_name: ""

  initialize: () ->
    # テンプレートを読みこんでおく
    @template = $(@template_name).text()

  # HTMLを描画する際に呼び出される関数
  # 上書きを想定
  execute: (params) -> {}

  # 描画処理。前後でフェードインとフェードアウトをするように
  render: (params) ->
    @$el.fadeOut "fast", =>
      @$el.html(Mustache.render(@template, @execute(params)))
      @$el.fadeIn("fast")

# ==========================================
# ここから各ページの定義
# ==========================================

# 単に表示のみ行う
IndexView = PageViewBase.extend
  template_name: '#index_view_template'

# 適当に値を受けとるパターン
OtherView = PageViewBase.extend
  template_name: '#other_view_template'

  execute: (params) ->
    # idが指定されていない場合0とする
    params.id = 0 unless params.id?
    val: params.id

AppView = Backbone.View.extend
  el: '#app'
  initialize: ->
    # イベントリスナー登録
    mediator = _.extend({},  Backbone.Events)
