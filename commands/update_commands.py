# this script needs to be run in the /commands folder and the documentation.md file should be in /
# command references need to be at the bottom otherwise this script will overwrite everything thats coming after these references
# if the heading of the command references changes line 58 needs to be changed to the new heading

import os
import math


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
        if lines[line].find("# " + filename) != -1:
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


# write the new table to the end of the markdown file

# save the old content of the documentation.md file (down to the heading '# Quick command references')
f = open(directory_in_str + "../documentation.md", "r")
lines = f.read().splitlines()
line = 0
content = []
while line < len(lines):
    if lines[line].find("# Quick command references") != -1:
        line = line + 1
        content = lines[0:line]
        break
    else:
        line = line + 1
        continue
f.close()

# open and overwrite documentation.md
f = open(directory_in_str + "../documentation.md", "w")

line = 0
while line < len(content):
    print(content[line], file=f)
    line = line + 1

print("", file=f)

# calculates the length of the rows
per_row = math.ceil(len(files)/4)

# append empty rows so we are not running out of the array length
# maximum of length difference between the rows is 3 => append 3 empty items

# sort list items alphabetical
files.sort()

files.append("")
files.append("")
files.append("")

row1 = files[0:per_row]
row2 = files[per_row:2*per_row]
row3 = files[2*per_row:3*per_row]
row4 = files[3*per_row:4*per_row]

l = 0

# format table and write it out (format: command | command | command | command)
while l < per_row:
    filename1 = row1[l].replace(".md", "")
    filename2 = row2[l].replace(".md", "")
    filename3 = row3[l].replace(".md", "")
    filename4 = row4[l].replace(".md", "")

    link_row1 = "[" + filename1 + "]" + "(/commands/" + filename1 + ".html)"
    link_row2 = "[" + filename2 + "]" + "(/commands/" + filename2 + ".html)"
    link_row3 = "[" + filename3 + "]" + "(/commands/" + filename3 + ".html)"
    if filename4 == "":
        link_row4 = ""
    else:
        link_row4 = "[" + filename4 + "]" + "(/commands/" + filename4 + ".html)"
    print(link_row1 + " | " + link_row2 + " | " + link_row3 + " | " + link_row4, file=f)
    l = l +1

f.close()