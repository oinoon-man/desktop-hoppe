; Custom NSIS include (auto-picked up by electron-builder as build/installer.nsh).
; Override the oneClick installer's progress text ("installing" message).
; electron-builder already defines this LangString from its bundled messages.yml,
; and builds with -WX (warnings = errors), so redefining it normally fails with
; warning 6030 ("set multiple times"). NSIS uses the LAST definition, so we
; suppress just 6030 around our overrides and restore it afterward.
; LCID: 1042 = Korean, 1033 = English (US).
!pragma warning disable 6030
LangString installing 1042 "버터랑 친구들 데려오는 중..."
LangString installing 1033 "Bringing Butter and friends over..."
!pragma warning default 6030
