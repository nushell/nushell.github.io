---
title: 使用 input listen 对按键进行操作
---

# 使用 `input listen` 对按键进行操作

常见的"按键监听"模式是：

- 监听特定按键（或一组按键）被按下
- 根据按下的按键采取行动
- 如果未按下预期按键，则循环

有几种模式可以实现这一点，每种模式都有优缺点。您可以选择以下最适合您用例和编码风格的其中一种模式：

1. 第一次尝试可能是以下简单循环。这适用于某些情况，但 `loop` 本身无法返回*值*：

   ```nu
   def run_some_code [] {
     print "I'm running the code, but I can't return a"
     print "value because I need to `break` out of the loop."
     42
     break
   }

   print '(a) Run some code (x) Exit'

   loop {
     let key = (input listen --types [key])
     if ($key.code == 'a') and ($key.modifiers == []) {
         run_some_code
     } else if ($key.code == 'x') and ($key.modifiers == []) {
         print 'User exited'
         break
     } else if ($key.code == 'c') and ($key.modifiers == ['keymodifiers(control)']) {
         print 'Terminated with Ctrl-C'
         break
     } else {
         print "That key wasn't recognized."
         print 'Press (a) to run some code or (x) to Exit'
         continue
     }
   }
   ```

2. 如果您需要返回值，可以在输入循环结束后使用可变变量保存按键结果，*然后*根据捕获的按键返回一个值：

   ```nu
   def run_some_code [] {
     print "I'm running the code and returning 42"
     42
   }

   mut key_props = []
   print '(a) Run some code (x) Exit'

   loop {
     let key = (input listen --types [key])
     $key_props = [$key.code $key.modifiers]
     let valid_keys = [
       [ 'a' [] ]
       [ 'x' [] ]
       [ 'c' ['keymodifiers(control)'] ]
     ]

     if $key_props in $valid_keys {
         break
     } else {
         print "That key wasn't recognized."
         print 'Press (a) to run some code or (x) to Exit'
         continue
     }
   }

   # 根据可变变量中捕获的按键进行操作
   if $key_props == [ 'a' [] ] {
       run_some_code
   } else if $key_props == [ 'x' [] ] {
       print 'User exited'
   } else if $key_props == [ 'c' ['keymodifiers(control)'] ] {
       print 'Terminated with Ctrl-C'
   }
   ```

3. 此版本使用一个自定义命令，该命令递归调用自身，直到按下所需按键之一。但是，请注意，Nushell 根据 `$env.config.recursion_limit` 的值（默认为 50）限制递归调用的次数。按住 <kbd>y</kbd> 键（未监控）以演示基于递归限制的提前退出。

   请注意，此版本不需要 `break` 语句。

   ```nu
   def run_some_code [] {
     print "I'm running the code and returning 42"
     42
   }

   print '(a) Run some code (x) Exit'

   def input_loop [] {
     let key = (input listen --types [key])
     if ($key.code == 'a') and ($key.modifiers == []) {
         run_some_code
     } else if ($key.code == 'x') and ($key.modifiers == []) {
         print 'User exited'
     } else if ($key.code == 'c') and ($key.modifiers == ['keymodifiers(control)']) {
         print 'Terminated with Ctrl-C'
     } else {
         print "That key wasn't recognized."
         print 'Press (a) to run some code or (x) to Exit'
         # 递归
         input_loop
     }
   }
   # 启动循环
   try {
     input_loop
   } catch {|e| print ($e.debug)}
   ```

4. `generate` 命令提供了一个功能性循环替代方案，没有递归限制或可变变量。`generate` 还可以将多个结果收集到列表中，并且输出是流式的。

   ```nu
   def run_some_code [] {
     print "I'm running the code and returning 42"
     42
   }

   print '(a) Run some code (x) Exit'

   let key_generator = {|_|
     let key = (input listen --types [key])

     if ($key.code == 'a') and ($key.modifiers == []) {
         # 返回没有 "next" 的 "out" 记录会终止循环
         { out: (run_some_code) }
     } else if ($key.code == 'x') and ($key.modifiers == []) {
         print 'User exited'
         { out: null }
     } else if ($key.code == 'c') and ($key.modifiers == ['keymodifiers(control)']) {
         print 'Terminated with Ctrl-C'
         { out: null }
     } else {
         print "That key wasn't recognized."
         print 'Press (a) to run some code or (x) to Exit'
         # 下一个按键生成
         { next: null }
     }
   }

   generate null $key_generator | get 0
   ```

## 使用带有键码列表的 match 语句

上述示例使用硬编码键值和 `if`/`else` 语句。您可能会发现使用带有键码和修饰符列表的 `match` 语句更容易维护代码。使用此技术，上面的第二个示例可能看起来像：

```nu
def run_some_code [] {
  print "I'm running the code and returning 42"
  42
}

let keys = {
  # [ key.code key.modifiers ]
  a:      [ 'a' [] ]
  x:      [ 'x' [] ]
  ctrl-c: [ 'c' ['keymodifiers(control)'] ]
}
mut key = {keycode: '', modifiers: ['']}
print '(a) Run some code (x) Exit'

loop {
  $key = (input listen --types [key])
  match [$key.code $key.modifiers] {
    $keymatch if $keymatch == $keys.a => {break}
    $keymatch if $keymatch == $keys.x  => {print 'User exited'; break}
    $keymatch if $keymatch == $keys.ctrl-c => {print 'Terminated with Ctrl-C'; break}
    _ => {
      print "That key wasn't recognized"
      print 'Press (a) to run some code or (x) to Exit'
      continue
    }
  }
}

# 根据可变变量中捕获的按键进行操作
match [$key.code $key.modifiers] {
  $k if $k == $keys.a => {run_some_code}
}
```
