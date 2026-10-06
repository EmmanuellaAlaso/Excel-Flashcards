const sessions=[
{t:'Data cleaning',d:'Day 1',c:[
['Why clean data','Why do we clean data before analysing it?','Dirty data breaks formulas and gives wrong answers. Clean once, trust always.'],
['Remove Duplicates','What does Remove Duplicates do?','Deletes repeated rows. Find it on the Data tab. Work on a copy first, because deletions are permanent.'],
['Flash Fill','What does Flash Fill do?','Spots your pattern and fills in the rest, no formula needed. Press `Ctrl + E` to accept.'],
['Text to Columns','What is Text to Columns for?','Splitting one column into several, like "John Smith, East" into name and region. Data tab → Text to Columns.'],
['Find & Replace','Which shortcut opens Find & Replace?','`Ctrl + H`. Use it to fix a typo everywhere at once, like "east" to "East".'],
['Go To Special','How can you fill every blank cell with 0 at once?','`Ctrl + G` → Special → Blanks, type 0, then press `Ctrl + Enter`.'],
['TRIM','What does TRIM do?','Removes extra spaces from text, e.g. `=TRIM(A2)`.'],
['AI safety','What should you never paste into AI?','Personal or sensitive data. Share only a few sample rows.']]},
{t:'Efficiency & collaboration',d:'Day 1',c:[
['Conditional Formatting','What does Conditional Formatting do?','Colours cells automatically by a rule, like sales over 50,000 turning green. Find it on the Home tab.'],
['Colour Scales','What is a colour scale?','A colour gradient across cells by value, like red for low and green for high. A heat map in a click.'],
['Data Bars','What does a Data Bar show?','A bar inside the cell. The longer the bar, the bigger the value.'],
['Freeze Panes','Why use Freeze Panes?','It keeps your headers in view while you scroll. View tab → Freeze Panes.'],
['Freeze Panes','Which option locks only the top row?','View → Freeze Panes → Freeze Top Row.'],
['Data Validation','What does Data Validation do?','Limits what can be typed into a cell, like a dropdown of East, West, North, South. Data tab.'],
['Shortcuts','Which shortcuts save your work and undo a mistake?','`Ctrl + S` saves. `Ctrl + Z` undoes.'],
['Comments','What is a Comment for?','Leaving a note on a cell and replying to colleagues. Right-click the cell → New Comment.']]},
{t:'Advanced formulas',d:'Day 2',c:[
['IF','What does the IF function do?','Makes a decision: one result if a test is true, another if false. e.g. `=IF(B2>=50,"Pass","Fail")`'],
['IF','What are the three parts of an IF formula?','The test, the result if true, and the result if false.'],
['SUMIF','What does SUMIF do?','Adds up only the values that meet a condition, like total sales for East.'],
['COUNTIF','What does COUNTIF do?','Counts only the cells that meet a condition, like how many rows say East.'],
['VLOOKUP','What is VLOOKUP for?','Finding information in a table, like the price of a product. Use `FALSE` for an exact match.'],
['XLOOKUP','Why is XLOOKUP the modern upgrade?','It looks in any direction, is easier to set up, and can say "Not found" instead of showing an error.'],
['TRIM','Why run TRIM before a lookup?','Hidden spaces cause #N/A errors. TRIM removes them.'],
['Joining text','How do you join two cells, like first and last name?','`=A2&" "&B2`, or use CONCAT or TEXTJOIN.']]},
{t:'Charts & sparklines',d:'Day 2',c:[
['Chart types','Which chart compares categories, like sales by region?','A column chart.'],
['Chart types','Which chart shows a trend over time?','A line chart.'],
['Chart types','Which chart shows parts of a whole?','A pie chart, best with fewer than 6 slices.'],
['Bar chart','When is a bar chart handy?','When category names are long, because the bars run sideways.'],
['Insert a chart','How do you create a chart in three steps?','Select your data, go to Insert → Charts, then pick a type.'],
['Chart polish','Which two things should every chart have?','A clear title and data labels.'],
['Sparklines','What is a sparkline?','A tiny chart that lives inside one cell, perfect for seeing a trend at a glance.'],
['Sparklines','Where do you insert a sparkline?','Insert tab → Sparklines, then choose Line, Column or Win/Loss.']]},
{t:'Case study: NovaTech sales',d:'Day 3',c:[
['The plan','What are the three phases of the case study?','Clean the data, analyse it, then visualise it.'],
['Clean first','Why clean before analysing?','Messy data gives wrong answers, however good your formulas are.'],
['Clean','Which tool removes duplicate sale IDs?','Remove Duplicates, on the Data tab.'],
['Clean','Which function fixes names like "john obi"?','PROPER, e.g. `=PROPER(A2)`.'],
['Tables','What does Ctrl + T do?','Turns your data into an Excel Table with filtering, sorting and a total row.'],
['PivotTable','What is a PivotTable good for?','Summarising lots of rows quickly, like sales by region and month.'],
['Charts','Which chart suits a monthly sales trend?','A line chart.'],
['AI helper','What is your job when AI writes a summary?','Check the numbers yourself before you use it.']]},
{t:'Survey & forecasting',d:'Day 3',c:[
['AVERAGE','What does AVERAGE do?','Finds the mean of a set of numbers, like the average satisfaction score.'],
['COUNTIF','How do you count how many people answered "Yes"?','`=COUNTIF(D:D,"Yes")`'],
['AVERAGEIF','What is AVERAGEIF?','Like SUMIF, but it averages only the rows that match your condition.'],
['Percentages','How do you turn a count into a percentage?','Divide it by the total, like Yes answers divided by all answers.'],
['Forecasting','What is forecasting?','Using past results to estimate a future value, like next month’s enrolments.'],
['FORECAST.LINEAR','What does FORECAST.LINEAR do?','Predicts a future value from the straight-line trend in your past data.'],
['Trendline','How do you show a trend on a line chart?','Right-click a data point → Add Trendline → Linear.'],
['Forecast note','Why add a note to a forecast?','Forecasts assume past patterns continue, so say which data it is based on.']]}];
/* Real-life scenarios: the last 4 cards of every session (8 core + 4 scenarios = 12) */
const SC=[
[ /* S1 Data cleaning */
['Split names','Scenario: Your manager sends 2,000 customers in one column as “John Smith” and wants first and last names in separate columns by lunchtime. What do you use?','Text to Columns on the Data tab, splitting at the space. It handles all 2,000 rows in one go.',['Retype every name into two new columns','Remove Duplicates on the Data tab','`=TRIM(A2)` filled down the column']],
['Double entries','Scenario: A survey export lists some people twice, so your totals are too high. What is the safest first move?','Copy the sheet as a backup, then use Remove Duplicates on the Data tab.',['Scroll through and delete repeats by eye','Use Find & Replace to delete the repeated names','Turn on Freeze Panes so the repeats are easier to spot']],
['Blank cells','Scenario: A finance tracker has blanks scattered through the Feb column, and the team agreed they count as zero. How do you fix them fast?','Select the range, press `Ctrl + G` → Special → Blanks, type 0, then press `Ctrl + Enter`.',['Click each blank cell and type 0','Use Remove Duplicates on the column','Press `Ctrl + E` to Flash Fill the column']],
['AI and staff data','Scenario: A colleague wants to paste the full staff list, with names and salaries, into a public AI tool for a quick summary. What do you advise?','Don’t paste personal or sensitive data. Share only a few anonymised sample rows.',['Go ahead, AI tools never keep what you paste','Paste it, but delete the header row first','Paste half the list so it is less risky']]
],
[ /* S2 Efficiency & collaboration */
['Lost headers','Scenario: Your sales sheet has 500 rows. Your boss scrolls down and can no longer tell which column is which. What do you do?','View → Freeze Panes → Freeze Top Row, so the headers stay in view.',['Copy the headers into every 20th row','Use Data Validation on the header row','Zoom out to 10% so everything fits on screen']],
['Highlight big sales','Scenario: Your manager wants every sale over 50,000 shown in green, including rows added next week. What is the best approach?','Conditional Formatting on the Home tab, with a rule for values over 50,000.',['Colour the big sales green by hand','Add a Comment to each big sale','Use Freeze Panes on the Sales column']],
['Messy typing','Scenario: In a shared tracker, people keep typing Region as “Est”, “east” and “Eastt”. How do you stop it?','Data Validation on the Data tab: a dropdown of East, West, North and South.',['Colour the Region column red as a warning','Email everyone and ask them to be careful','Add a Colour Scale to the Region column']],
['Question for a colleague','Scenario: A number in a teammate’s cell looks wrong. How do you flag it without changing the number?','Right-click the cell → New Comment, and tag your colleague in the note.',['Type your question inside the cell','Change the cell colour and hope they notice','Delete the number and retype it']]
],
[ /* S3 Advanced formulas */
['Pass or fail','Scenario: You have 200 exam scores in column B and the pass mark is 50. You need a Pass or Fail label beside each one. Which formula do you fill down?','`=IF(B2>=50,"Pass","Fail")`',['`=COUNTIF(B2,50)`','`=SUMIF(B2,"Pass","Fail")`','`=AVERAGE(B2,50)`']],
['Regional total','Scenario: Your sheet lists thousands of sales across every region (region in B, amount in C). The director wants the total for East only. Which formula?','`=SUMIF(B:B,"East",C:C)`',['`=SUM(B:B,"East")`','`=COUNTIF(B:B,"East")`','`=IF(B:B="East",C:C)`']],
['Prices from a list','Scenario: Orders sit on one sheet and prices on another. You need each price beside its order, with “Not found” for unknown codes. What do you use?','`XLOOKUP`, with “Not found” as the if-not-found value.',['`SUMIF` on the price list','`COUNTIF` on the order codes','`TRIM` on the order codes']],
['The mystery #N/A','Scenario: Your VLOOKUP shows #N/A even though the customer ID looks identical in both lists. What is the most likely fix?','Hidden spaces are the likely cause, so wrap the lookup value in `TRIM`.',['Change `FALSE` to `TRUE` so it guesses','Delete the lookup table and start again','Sort the lookup table in reverse order']]
],
[ /* S4 Charts & sparklines */
['Monthly trend','Scenario: You have revenue for January to December and must show leadership how it moved over the year. Which chart?','A line chart, because it shows a trend over time.',['A pie chart with 12 slices','A column of data bars with no axis','A pie chart sorted A to Z']],
['Share of total','Scenario: Three regions made up this quarter’s sales, and your boss wants to see each region’s share of the whole. Which chart?','A pie chart. With only three slices it reads clearly.',['A line chart across the regions','A sparkline in one cell','A trendline on the region names']],
['40 branches','Scenario: A table shows 12 months of sales for each of 40 branches. You want a tiny trend beside every branch, not 40 big charts. What do you use?','Sparklines: Insert → Sparklines → Line, in one column beside the data.',['Insert 40 separate charts','Add a pie chart for each branch','Use Freeze Panes on the branch column']],
['Long labels','Scenario: Your column chart has category names like “Customer Service Department” that are squashed and unreadable. What is the simple fix?','Switch to a bar chart, so the names run sideways and have room.',['Shrink the labels to the smallest font','Switch to a pie chart','Delete the labels and the title']]
],
[ /* S5 Case study: NovaTech sales */
['Repeat sale IDs','Scenario: The NovaTech export contains the same sale ID twice. What do you do before analysing anything?','Clean first: Data → Remove Duplicates on the Sale ID column, ideally on a copy.',['Build a PivotTable first and ignore the repeats','Add a chart and a trendline first','Add a Colour Scale to spot the repeats']],
['Messy names','Scenario: Customer names were typed as “john obi” and “ADA EZE”. How do you make them look right?','`=PROPER(A2)`, which capitalises the first letter of each word.',['`=TRIM(A2)`','`=UPPER(A2)`','`=COUNTIF(A2,"Name")`']],
['Quick summary','Scenario: The CEO asks for sales by region and by month from 8,000 rows, in minutes. What is the best tool?','A PivotTable. It summarises thousands of rows in a few clicks.',['Filter and add up each region by hand','Write an IF formula on every row','Apply a Colour Scale to the sales column']],
['AI summary check','Scenario: An AI tool writes “sales grew 25% in Q3” and you present in ten minutes. What do you do?','Check the figure against your own data first. You are responsible for the numbers.',['Put it on the slide as it is','Ask the AI if it is sure, and trust the reply','Trust it, since AI does not make maths errors']]
],
[ /* S6 Survey & forecasting */
['Count the Yes answers','Scenario: A survey has 500 answers in column D. You need to know how many said “Yes”. Which formula?','`=COUNTIF(D:D,"Yes")`',['`=AVERAGE(D:D)`','`=SUMIF(D:D,"Yes")`','`=IF(D:D,"Yes")`']],
['Average for one branch','Scenario: You need the average satisfaction score (column C) for the East branch only (branch in column B). Which formula?','`=AVERAGEIF(B:B,"East",C:C)`',['`=AVERAGE(C:C)`','`=COUNTIF(B:B,"East")`','`=SUMIF(B:B,"East",C:C)`']],
['Report a percentage','Scenario: 180 of 240 people answered “Yes”, and your report needs a percentage. What do you do?','Divide 180 by 240 and format the result as a percentage, which gives 75%.',['Divide 240 by 180 to get 133%','Add 180 and 240','Multiply 180 by 240']],
['Next month’s enrolments','Scenario: You have 12 months of enrolments and must estimate next month. What is the right approach?','Use `FORECAST.LINEAR` on the past months, and add a note that it assumes the trend continues.',['Copy last month’s number and call it a forecast','Type the number you are hoping for','Use `COUNTIF` on the month names']]
]
];
SC.forEach((cards,index)=>sessions[index].c.push(...cards));
window.SHEETWISE_SESSIONS = sessions;
