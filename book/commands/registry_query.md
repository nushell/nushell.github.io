---
title: registry query
categories: |
  system
version: 0.70.0
system: |
  Query the Windows registry.
usage: |
  Query the Windows registry.
---

# <code>{{ $frontmatter.title }}</code> for system

<div class='command-title'>{{ $frontmatter.system }}</div>

## Signature

```> registry query (key) (value) --hkcr --hkcu --hklm --hku --hkpd --hkpt --hkpnls --hkcc --hkdd --hkculs```

## Parameters

 -  `key`: registry key to query
 -  `value`: optionally supply a registry value to query
 -  `--hkcr`: query the hkey_classes_root hive
 -  `--hkcu`: query the hkey_current_user hive
 -  `--hklm`: query the hkey_local_machine hive
 -  `--hku`: query the hkey_users hive
 -  `--hkpd`: query the hkey_performance_data hive
 -  `--hkpt`: query the hkey_performance_text hive
 -  `--hkpnls`: query the hkey_performance_nls_text hive
 -  `--hkcc`: query the hkey_current_config hive
 -  `--hkdd`: query the hkey_dyn_data hive
 -  `--hkculs`: query the hkey_current_user_local_settings hive

## Notes
```text
Currently supported only on Windows systems.
```
## Examples

Query the HKEY_CURRENT_USER hive
```shell
> registry query --hkcu environment
```

Query the HKEY_LOCAL_MACHINE hive
```shell
> registry query --hklm 'SYSTEM\CurrentControlSet\Control\Session Manager\Environment'
```
