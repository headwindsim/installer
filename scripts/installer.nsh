!macro customInit
  ${ifNot} ${isUpdated}
    nsExec::Exec '"$LOCALAPPDATA\headwind_installer\Update.exe" --uninstall -s'
    delete "$LOCALAPPDATA\headwind_installer\Update.exe"
    delete "$LOCALAPPDATA\headwind_installer\.dead"
    rmDir "$LOCALAPPDATA\headwind_installer"
  ${endIf}
!macroend