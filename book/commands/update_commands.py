# this script needs to be run in the /commands foler
# command references need to be at the bottom otherwise this script will overwrite everything that's coming after these references
# if the heading of the command references changes line 58 needs to be changed to the new heading

import os
import math
import subprocess
from shutil import copyfile

version = input("enter current project version: ")

os.mkdir("tmp")
os.chdir("tmp")
git_return = subprocess.call(["git","init",])
if git_return == 1:
    print("error: couldn't initialize git repo")
    os.chdir("../")
    subprocess.call(["rm", "-rf", "tmp"])
    exit(1)
git_return = subprocess.call(["git", "remote", "add", "origin", "-f", "https://github.com/nushell/nushell"])
if git_return == 1:
    print("error: couldn't add git remote repo (check internet connection)")
    os.chdir("../")
    subprocess.call(["rm", "-rf", "tmp"])
    exit(1)

os.chdir(".git/info")
directory_in_str = os.getcwd() + "/"
f = open(directory_in_str + "sparse-checkout", "a")
f.write("docs/commands")
f.close()
subprocess.call(["git","config","core.sparseCheckout", "true"])
os.chdir("../../")
git_return = subprocess.call(["git","pull","origin","main"])
if git_return == 1:
    print("error: couldn't clone repo (check internet connection)")
    os.chdir("../")
    subprocess.call(["rm", "-rf", "tmp"])
    exit(1)

directory_in_str = os.getcwd() + "/"

directory = os.fsencode(directory_in_str)
for file in os.listdir(directory):
    filename = os.fsdecode(file)
    if filename.endswith(".md"):
        os.remove(filename)
        continue
    else:
        continue

os.chdir("../")

os.chdir("tmp/docs/commands")
directory_in_str = os.getcwd() + "/"

# get all files in the working directory which are of type *.md (except the readme file)
directory = os.fsencode(directory_in_str)
files = []
for file in os.listdir(directory):
    filename = os.fsdecode(file)
    if filename.endswith(".md"):
        if filename.startswith("README"):
            continue
        else:
            files.append(filename)
            continue
    else:
        continue

# delete the main heading of the markdown file and write title and layout in Front Matter
for file in files:
    f = open(directory_in_str + file, "r")
    filename = file.replace(".md", "")
    lines = f.read().splitlines()
    line = 0
    f.close()

    # open and overwrite the command documentation
    f = open(directory_in_str + file, "w")
    while line < len(lines):
        replacement = filename.replace("-", " ")
        if lines[line].find("# " + replacement) != -1:
            print("---", file=f)
            print("title: " + replacement, file=f)
            print("layout: command", file=f)
            print("nu_version: " + version, file=f)
            print("---", file=f)
            line = line + 1
            continue
        else:
            print(lines[line],file=f)
            line = line + 1
            continue

f.close()

print(os.getcwd())

directory_in_str = os.getcwd() + "/"

directory = os.fsencode(directory_in_str)
for file in os.listdir(directory):
    filename = os.fsdecode(file)
    copyfile(filename,"../../../" + filename)

os.chdir("../../../")
subprocess.call(["rm", "-rf", "tmp"])
