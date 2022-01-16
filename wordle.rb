##################################################################################

# dashes for unknown, lowercase letters where exact location known
KNOWN = '-----'

# lowercase letters, no separator
NOT_ANYWHERE = ''
NOT_1 = ''
NOT_2 = ''
NOT_3 = ''
NOT_4 = ''
NOT_5 = ''

##################################################################################

gem 'pry'
require 'pry'
words = File.read('words.txt').split

KNOWN.split('').each_with_index do |letter, index|
  words.select! {|word| word[index] == letter} unless letter == '-'
end

not_anywhere_regex = Regexp.new(NOT_ANYWHERE.split('').join('|'))
words.reject! {|word| word.match(not_anywhere_regex)}

NOT_1.split('').each do |letter|
  words.select! {|word| word.include?(letter)}
  words.reject! {|word| word[0] == letter}
end

NOT_2.split('').each do |letter|
  words.select! {|word| word.include?(letter)}
  words.reject! {|word| word[1] == letter}
end

NOT_3.split('').each do |letter|
  words.select! {|word| word.include?(letter)}
  words.reject! {|word| word[2] == letter}
end

NOT_4.split('').each do |letter|
  words.select! {|word| word.include?(letter)}
  words.reject! {|word| word[3] == letter}
end

NOT_5.split('').each do |letter|
  words.select! {|word| word.include?(letter)}
  words.reject! {|word| word[4] == letter}
end

puts words