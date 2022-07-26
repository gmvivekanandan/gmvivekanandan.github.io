---
title: DICE CTF@HOPE 2022
author: Cerberus™
date: 2022-07-26
categories: [writeups, DICE CTF@HOPE 2022]
tags: [git, python]
---

## rev/slices

**Description: Have a slice**

Given python file

```python
flag = input('Enter flag: ')

def fail():
    print('Wrong!')
    exit(-1)

if len(flag) != 32: fail()

if flag[:5] != 'hope{': fail()
if flag[-1] != '}': fail()
if flag[5::3] != 'i0_tnl3a0': fail()
if flag[4::4] != '{0p0lsl': fail()
if flag[3::5] != 'e0y_3l': fail()
if flag[6::3] != '_vph_is_t': fail()
if flag[7::3] != 'ley0sc_l}': fail()

print('Congrats!')
print('flag is: ', flag)
```

Solve script

```python
flag = ['x' for _ in range(0,32)]
flag[:5] = 'hope{'
flag[-1] = '}'
flag[5::3] = 'i0_tnl3a0'
flag[4::4] = '{0p0lsl'
flag[3::5] = 'e0y_3l'
flag[6::3] = '_vph_is_t'
flag[7::3] = 'ley0sc_l}'
print(''.join(flag))
```

**flag:hope{i_l0ve_pyth0n_slic3s_a_l0t}**

## misc/orphan

**Description: nothing to see here**

[orphan.zip](https://static.dicega.ng/uploads/e4353c92e25cdc53bcd459e59ebbe14ed740f17aca26b837cff98a2b5dbcc73a/orphan.zip)

Visit `/orphan/.git/logs`{: .filepath}

```git
0000000000000000000000000000000000000000 2ce03bc4ae69cd194b7680b18172641f7d56fbbf William Wang <defund@users.noreply.github.com> 1658084429 -0400 commit (initial): add foo
0000000000000000000000000000000000000000 2ce03bc4ae69cd194b7680b18172641f7d56fbbf William Wang <defund@users.noreply.github.com> 1658084534 -0400 checkout: moving from flag to main
0000000000000000000000000000000000000000 b53c9e6864ed176ea0192fd8283362a41d94906c William Wang <defund@users.noreply.github.com> 1658084626 -0400 commit (initial): add flag
b53c9e6864ed176ea0192fd8283362a41d94906c 2ce03bc4ae69cd194b7680b18172641f7d56fbbf William Wang <defund@users.noreply.github.com> 1658084645 -0400 checkout: moving from flag to main
```

Move to the commit where the flag was added using `git checkout -b res b53c9e6864ed176ea0192fd8283362a41d94906c`

**flag:hope{ba9f11ecc3497d9993b933fdc2bd61e5}**