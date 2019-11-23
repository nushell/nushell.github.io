import os
import math

directory_in_str = os.getcwd() + "/"

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


for file in files:
    path = directory_in_str + file
    f = open(path,"r")
    filename = file.replace(".md", "")
    lines = f.read().splitlines()
    line = 0
    f.close()
    f = open(path, "w")
    while line < len(lines):
        if lines[line].find("# " + filename) == 0:
            print("---", file=f)
            print("title: " + filename, file=f)
            print("layout: command", file=f)
            print("---", file=f)
            line = line + 1
            continue
        else:
            print(lines[line],file=f)
            line = line + 1
            continue

f.close()
f = open(directory_in_str + "00_newtable.txt", "w")
per_row = math.ceil(len(files)/4)
files.append("")
files.append("")
files.append("")
files.append("")

row1 = files[0:per_row]
row2 = files[per_row:2*per_row]
row3 = files[2*per_row:3*per_row]
row4 = files[3*per_row:4*per_row]

l = 0
while l < per_row:
    filename1 = row1[l].replace(".md", "")
    filename2 = row2[l].replace(".md", "")
    filename3 = row3[l].replace(".md", "")
    filename4 = row4[l].replace(".md", "")
    print("[" + filename1 + "]" + "(/commands/" + filename1 + ".html)" + " | " + "[" + filename1 + "]" + "(/commands/" + filename1 + ".html)" + " | " + "[" + filename1 + "]" + "(/commands/" + filename1 + ".html)" + " | " + "[" + filename1 + "]" + "(/commands/" + filename1 + ".html)", file=f)
    l = l +1

f.close()