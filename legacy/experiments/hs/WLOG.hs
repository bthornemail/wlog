{-# LANGUAGE UndecidableInstances #-}
{-# LANGUAGE RankNTypes #-}

--------------------------------------------------------------------------------
-- WLOG: The Constitutional Computational Substrate
-- Pure Haskell DSL (no external dependencies)
--
-- Version: 1.0
-- Date: 2026-04-15
--------------------------------------------------------------------------------

module WLOG 
  ( -- Primes
    Prime(..)
  , Prime'(..)
    -- Structural
  , (.@)
  , (.\/)
  , Replay(..)
  , Index(..)
  , Project(..)
    -- Clocks
  , Clock(..)
  , sigma0
  , sigma7
  , sigma15
  , sigma60
  , omega
  , tick
    -- Address
  , Address(..)
  , lane
  , channel
  , slot
  , witness
    -- Projections
  , Projection(..)
  , toBraille
  , toHexagram
  , toMatrix
  , toUTF
  , toHTML
    -- Graph (PG surface)
  , Value(..)
  , nullV
  , textV
  , intV
  , boolV
  , Node(..)
  , Edge(..)
  , Labels(..)
  , Props(..)
  , Entity(..)
  , node
  , nodeL
  , nodeLP
  , edge
  , edgeL
  , edgeId
  , edgeFull
  , label
  , prop
  , emitPG
  , emitGraph
  , pgExample
  , pgPerson
  , pgKnows
  , pgSmall3
  , toSVG
  , toHTML
  , toAFrame
    -- Runners
  , run
  , trace
  ) where

import Data.Bits (xor, (.&.), (.|.))
import Data.Bool (bool)
import Numeric (showHex)
import Text.Printf (printf)
import Data.List (intercalate, isInfixOf)
import Data.Char (toLower)

--------------------------------------------------------------------------------
-- 6. GRAPH: PG Format Surface (Constitutional Core Output)
--------------------------------------------------------------------------------

-- | Value types for properties
data Value 
  = VText String      -- ^ Quoted text
  | VInt Int          -- ^ Integer
  | VBool Bool        -- ^ Boolean
  | VNull            -- ^ Null/empty
  deriving (Eq, Ord)

-- | Show instance for Value (PG format)
instance Show Value where
  show (VText s) = "\"" ++ escapeText s ++ "\""
  show (VInt n)  = show n
  show (VBool b) = map toLower (show b)
  show VNull     = ""

-- | Escape text for PG: escape quotes, pipes, special chars
escapeText :: String -> String
escapeText [] = []
escapeText (c:cs) = case c of
  '"'  -> "\\\"" ++ escapeText cs
  '\\' -> "\\\\" ++ escapeText cs
  '|'  -> "\\|" ++ escapeText cs
  '\n' -> "\\n" ++ escapeText cs
  '\r' -> "\\r" ++ escapeText cs
  _   -> c : escapeText cs

-- | Quote if needed (PG rules)
quoteIfNeeded :: String -> String
quoteIfNeeded s
  | needsQuote s = "\"" ++ s ++ "\""
  | otherwise    = s
  where
    needsQuote s = or $ map (`elem` s) " <>|:\\/#'\""

-- | Node identifier
newtype Node = Node { unNode :: String } deriving (Eq, Ord)

-- | Show instance
instance Show Node where
  show (Node n) = quoteIfNeeded n

-- | Edge with optional ID
data Edge = Edge 
  { edgeId   :: Maybe String  -- ^ Optional edge ID
  , edgeFrom :: String       -- ^ From node ID  
  , edgeTo   :: String       -- ^ To node ID
  } deriving (Eq, Ord)

-- | Show instance
instance Show Edge where
  show (Edge mid f t) = 
    (case mid of Just i -> quoteIfNeeded i ++ ": "; Nothing -> "") ++
    quoteIfNeeded f ++ " -> " ++ quoteIfNeeded t

-- | Labels (comma-separated, colon-prefixed)
newtype Labels = Labels { unLabels :: [String] } deriving (Eq, Ord)

-- | Show instance
instance Show Labels where
  show (Labels []) = ""
  show (Labels ls) = " " ++ intercalate "," (map (": " ++) ls)

-- | Properties: key -> [Value]
newtype Props = Props { unProps :: [(String, [Value])] } deriving (Eq, Ord)

-- | Show instance
instance Show Props where
  show (Props []) = ""
  show (Props ps) = " " ++ intercalate " " (map emitProp ps)
    where
      emitProp (k,vs) = k ++ ": " ++ intercalate "," (map show vs)

-- | Full PG entity
data Entity 
  = NodeE Node Labels Props
  | EdgeE Edge Labels Props
  deriving (Eq, Ord)

-- | Show instance
instance Show Entity where
  show (NodeE n ls ps) = show n ++ show ls ++ show ps
  show (EdgeE e ls ps) = show e ++ show ls ++ show ps

-- | Build node (minimal)
node :: String -> Entity
node n = NodeE (Node n) (Labels []) (Props [])

-- | Build node with labels
nodeL :: String -> [String] -> Entity
nodeL n ls = NodeE (Node n) (Labels ls) (Props [])

-- | Build node with labels + props
nodeLP :: String -> [String] -> [(String, [Value])] -> Entity
nodeLP n ls ps = NodeE (Node n) (Labels ls) (Props ps)

-- | Build edge (minimal)
edge :: String -> String -> Entity
edge f t = EdgeE (Edge Nothing f t) (Labels []) (Props [])

-- | Build edge with label
edgeL :: String -> String -> String -> Entity
edgeL f t l = EdgeE (Edge Nothing f t) (Labels [l]) (Props [])

-- | Build edge with ID
edgeWithId :: String -> String -> String -> Entity
edgeWithId i f t = EdgeE (Edge (Just i) f t) (Labels []) (Props [])

-- | Build edge with full attributes
edgeFull :: String -> String -> String -> [(String, [Value])] -> Entity
edgeFull f t l ps = EdgeE (Edge Nothing f t) (Labels [l]) (Props ps)

-- | Add label
label :: String -> Entity -> Entity
label l (NodeE n (Labels ls) p) = NodeE n (Labels (l:ls)) p
label l (EdgeE e (Labels ls) p) = EdgeE e (Labels (l:ls)) p

-- | Add property
prop :: String -> [Value] -> Entity -> Entity
prop k v (NodeE n l (Props ps)) = NodeE n l (Props ((k,v):ps))
prop k v (EdgeE e l (Props ps)) = EdgeE e l (Props ((k,v):ps))

-- | Null value helper
nullV :: Value
nullV = VNull

-- | Text value helper
textV :: String -> Value
textV = VText

-- | Int value helper
intV :: Int -> Value
intV = VInt

-- | Bool value helper  
boolV :: Bool -> Value
boolV = VBool

--------------------------------------------------------------------------------
-- 7. PG FORMAT SERIALIZER
--------------------------------------------------------------------------------

-- | Emit entity as PG text (uses Show instance)
emitPG :: Entity -> String
emitPG = show

-- | Emit full graph as PG text
emitGraph :: [Entity] -> String
emitGraph = intercalate "\n" . map emitPG

-- | 3 CANONICAL EXAMPLES

-- | Example 1: Single person node
pgPerson :: String
pgPerson = emitPG $ node "alice" `label` "person" `prop` "age" [intV 42]

-- | Example 2: Single relationship edge  
pgKnows :: String
pgKnows = emitPG $ edgeL "alice" "bob" "knows" `prop` "since" [intV 2020]

-- | Example 3: Small 3-node graph
pgSmall3 :: String
pgSmall3 = emitGraph
  [ node "alice" `label` "person" `prop` "age" [intV 42]
  , node "bob" `label` "person" `prop` "age" [intV 36]
  , node "charlie" `label` "person" `prop` "age" [intV 28]
  , edgeL "alice" "bob" "knows" `prop` "since" [intV 2020]
  , edgeL "bob" "charlie" "knows" `prop` "since" [intV 2021]
  ]

-- | Default example (alias)
pgExample :: String
pgExample = pgSmall3

--------------------------------------------------------------------------------
-- 8. SVG / HTML / A-FRAME EMITTERS
--------------------------------------------------------------------------------

-- | SVG attributes from entity
toSVG :: Entity -> String
toSVG (NodeE (Node n) (Labels ls) (Props ps)) =
  unwords ["id=" ++ show n, "class=" ++ show (unLabels ls), "data-props=" ++ show (map f ps)]
  where
    f (k,vs) = k ++ "=" ++ intercalate "," vs
toSVG (EdgeE (Edge mid f t) (Labels ls) (Props ps)) =
  unwords ["from=" ++ show f, "to=" ++ show t, "data-props=" ++ show ps]

-- | HTML data-* attributes  
toDataAttr :: Entity -> String
toDataAttr (NodeE (Node n) (Labels ls) (Props ps)) =
  unwords $ ["data-node=" ++ show n] ++ map (("data-" ++) . f) ps
  where
    f (k,vs) = k ++ "=" ++ show (intercalate ", " vs)
toDataAttr (EdgeE (Edge _ f t) (Labels ls) (Props ps)) =
  unwords $ ["data-from=" ++ show f, "data-to=" ++ show t] ++ map (("data-" ++) . f) ps
  where
    f (k,vs) = k ++ "=" ++ show (intercalate ", " vs)

-- | A-Frame entity component attributes
toAFrame :: Entity -> String
toAFrame (NodeE (Node n) (Labels ls) (Props ps)) =
  unwords $ ["node=" ++ show n, "label=" ++ show ls] ++ map (("data-" ++) . f) ps
  where
    f (k,vs) = k ++ "=" ++ show (intercalate ", " vs)
toAFrame (EdgeE (Edge _ f t) (Labels ls) (Props ps)) =
  unwords $ ["from=" ++ show f, "to=" ++ show t] ++ map (("data-" ++) . f) ps
  where
    f (k,vs) = k ++ "=" ++ show (intercalate ", " vs)

--------------------------------------------------------------------------------
-- 9. GRAPH RUNNER
--------------------------------------------------------------------------------

-- | Parse PG back to entities (simple version)
parsePG :: String -> [Entity]
parsePG s = map parseEntity (lines s)

parseEntity :: String -> Entity
parseEntity s = case break (== " ") s of
  (n, ' ':rest) | "->" `isInfixOf` s -> 
    let (fid:tid:_) = words (map (\c -> if c == '-' then ' ' else c) s)
    in edge fid tid
  (n, "") -> node n
  _ -> node s

--------------------------------------------------------------------------------
-- 1. ALPHABET: The 9 Prime Symbols
--------------------------------------------------------------------------------

-- | The 9 prime symbols forming the constitutional alphabet
data Prime 
  = WLOG    -- ^ Closure Anchor - nothing precedes it
  | MONAD  -- ^ Identity: λx.x
  | FUNCTOR -- ^ Map: λf.λx.f x
  | XOR    -- ^ Exclusive Disjoin
  | AND    -- ^ Conjunction
  | OR     -- ^ Disjunction
  | NOT    -- ^ Negation
  | NOR    -- ^ Joint Denial
  | NAND   -- ^ Not Conjunction
  deriving (Eq, Show)

-- | Extended symbols derived from primes
data Prime' 
  = P Prime
  | IFF     -- ^ (a → b) ∧ (b → a)
  | XNOR    -- ^ ¬(a XOR b)
  | TRUE    -- ^ Constant true
  | FALSE   -- ^ Constant false
  | ZERO    -- ^ WLOG (absence)
  | UNIT    -- ^ MONAD (identity)
  deriving (Eq, Show)

instance Semigroup Prime where
  a <> _ = a  -- Composition: rightmost evaluates first

instance Monoid Prime where
  mempty = WLOG

--------------------------------------------------------------------------------
-- 2. STRUCTURAL LAWS
--------------------------------------------------------------------------------

infixl 9 .@
infixl 8 .\/

-- | Compose: (a .@ b) = λx.a(bx)
-- Rightmost evaluates first (normal order reduction)
(.@) :: (a -> c) -> (b -> a) -> b -> c
(.@) f g = \x -> f (g x)

-- | Join: (a .\/) = a ∨ b with a ∧ b = 0 (disjoint union)
(.\/) :: Bool -> Bool -> Bool
(.\/) a b = a || b

-- | Replay: append-only iteration
class Replay a where
  replay :: a -> [a]

instance Replay Prime where
  replay WLOG    = repeat WLOG
  replay MONAD  = repeat MONAD
  replay FUNCTOR = repeat FUNCTOR
  replay XOR    = repeat XOR
  replay AND    = repeat AND
  replay OR     = repeat OR
  replay NOT    = repeat NOT
  replay NOR   = repeat NOR
  replay NAND  = repeat NAND

-- | Index: zero-positioned access
class Index a where
  index :: a -> Int -> Maybe a

instance Index [Prime] where
  index [] _     = Nothing
  index (x:_) 0 = Just x
  index (_:xs) n = index xs (n - 1)

-- | Projection encoding
class Project a p where
  project :: a -> p

--------------------------------------------------------------------------------
-- 3. CLOCK LAWS
--------------------------------------------------------------------------------

-- | Temporal state with period
data Clock = Clock 
  { period :: !Int        -- Period length
  , ticks  :: [Prime]    -- Tick sequence
  } deriving (Eq, Show)

-- | Identity clock (no temporal change)
sigma0 :: Clock
sigma0 = Clock 1 (repeat MONAD)

-- | Heptadic pulse: 7 positions, then return
sigma7 :: Clock
sigma7 = Clock 7 [MONAD,MONAD,MONAD,MONAD,MONAD,MONAD,MONAD]

-- | Pentadecimal pulse: 15 positions, then return  
sigma15 :: Clock
sigma15 = Clock 15 (replicate 15 MONAD)

-- | Sexagesimal cycle: 60 positions, then return
sigma60 :: Clock
sigma60 = Clock 60 (replicate 60 MONAD)

-- | Full closure: LCM(7,60) = 420, then STOP
omega :: Clock
omega = Clock 420 (replicate 420 MONAD)

-- | Tick advancement
tick :: Clock -> Int -> Prime
tick c n = ticks c !! (n `mod` period c)

--------------------------------------------------------------------------------
-- 4. ADDRESS LAWS  
--------------------------------------------------------------------------------

-- | Address types
data Address 
  = Lane !Int           -- ^ Sequential lane position
  | Channel !Int        -- ^ Isolated replay stream ID
  | Slot !(Int,Int)    -- ^ 2D: (lane, channel)
  | Witness !Prime    -- ^ Deterministic fingerprint
  deriving (Eq, Show)

-- | Lane access
lane :: Int -> Address
lane = Lane

-- | Channel access  
channel :: Int -> Address
channel = Channel

-- | Slot access
slot :: (Int,Int) -> Address
slot = Slot

-- | Witness hash (compact digest)
witness :: Prime -> Address
witness = Witness

-- | Hash function for witnesses
hashPrime :: Prime -> Int
hashPrime WLOG   = 0
hashPrime MONAD   = 1
hashPrime FUNCTOR = 2
hashPrime XOR    = 3
hashPrime AND    = 4
hashPrime OR     = 5
hashPrime NOT   = 6
hashPrime NOR   = 7
hashPrime NAND  = 8

--------------------------------------------------------------------------------
-- 5. PROJECTION LAWS
--------------------------------------------------------------------------------

-- | Projection output types
data Projection 
  = Braille !String    -- ^ 6-dot tactile encoding
  | Hexagram !String  -- ^ 6-line I Ching
  | Matrix !(Int,Int) -- ^ 2x2 matrix
  | UTF !Int         -- ^ Unicode code point
  | HTML !String     -- ^ DOM element
  deriving (Eq, Show)

-- | Braille encoding (6-dot binary)
toBraille :: Prime -> Projection
toBraille WLOG   = Braille "⠁"    -- dot 1
toBraille MONAD  = Braille "⠃"    -- dots 1,2
toBraille FUNCTOR = Braille "⠉"   -- dots 1,3
toBraille XOR   = Braille "⠊"    -- dots 1,2,3
toBraille AND   = Braille "⠋"    -- dots 1,2,4
toBraille OR   = Braille "⠍"    -- dots 1,4
toBraille NOT  = Braille "⠁"    
toBraille NOR   = Braille "⠃"   
toBraille NAND  = Braille "⠇"   

-- | Hexagram encoding (I Ching 6-line)
toHexagram :: Prime -> Projection
toHexagram WLOG   = Hexagram "☰"  -- all solid
toHexagram MONAD  = Hexagram "☱"  -- top broken
toHexagram FUNCTOR = Hexagram "☲"  -- second broken
toHexagram XOR   = Hexagram "☳"  
toHexagram AND   = Hexagram "☴"  
toHexagram OR   = Hexagram "☵"  
toHexagram NOT  = Hexagram "☰"  
toHexagram NOR   = Hexagram "☱"  
toHexagram NAND  = Hexagram "☳"  

-- | Matrix encoding (2x2 linear algebra)
toMatrix :: Prime -> Projection
toMatrix MONAD = Matrix (1,0)    -- [[1,0],[0,1]] = identity
toMatrix NOT  = Matrix (0,1)    -- [[0,1],[1,0]] = flip
toMatrix _    = Matrix (0,0)   -- undefined for others

-- | UTF encoding (Unicode code point)
toUTF :: Prime -> Projection
toUTF WLOG    = UTF 0x0000   -- null
toUTF MONAD   = UTF 0x0001   -- SOH
toUTF FUNCTOR = UTF 0x0002   -- STX
toUTF XOR    = UTF 0x0003   -- ETX
toUTF AND    = UTF 0x0004   -- EOT
toUTF OR     = UTF 0x0005   -- ENQ
toUTF NOT    = UTF 0x0006   -- ACK
toUTF NOR    = UTF 0x0007   -- BEL
toUTF NAND   = UTF 0x0008   -- BS

-- | HTML encoding (DOM element)
toHTML :: Prime -> Projection
toHTML WLOG   = HTML "<null>"
toHTML MONAD  = HTML "<identity>"
toHTML FUNCTOR = HTML "<map>"
toHTML XOR    = HTML "<xor>"
toHTML AND    = HTML "<and>"
toHTML OR     = HTML "<or>"
toHTML NOT    = HTML "<not>"
toHTML NOR    = HTML "<nor>"
toHTML NAND   = HTML "<nand>"

--------------------------------------------------------------------------------
-- 6. BOOLEAN OPERATIONS (for completeness)
--------------------------------------------------------------------------------

-- | Boolean evaluation
eval :: Bool -> Bool -> Prime -> Bool
eval a b XOR   = a `xor` b
eval a b AND   = a && b  
eval a b OR    = a || b
eval _ _ NOT   = not a
eval a b NOR   = not (a || b)
eval a b NAND  = not (a && b)

--------------------------------------------------------------------------------
-- 7. RUNNERS
--------------------------------------------------------------------------------

-- | Run a prime with clock
run :: Prime -> Clock -> Int -> Prime
run p c t = tick c t

-- | Trace execution
trace :: Prime -> [String]
trace p = map show (replicate 10 p)

--------------------------------------------------------------------------------
-- 8. MAIN (for ghci testing)
--------------------------------------------------------------------------------

-- | Example usage in ghci:
-- > run MONAD sigma60 45
-- MONAD
--
-- > toBraille WLOG
-- Braille "⠁"
--
-- > tick sigma7 3
-- MONAD

-- | Test runner
main :: IO ()
main = do
  putStrLn "=== WLOG Constitutional Substrate ==="
  putStrLn $ "sigma0 period: " ++ show (period sigma0)
  putStrLn $ "sigma7 period: " ++ show (period sigma7)
  putStrLn $ "sigma60 period: " ++ show (period sigma60)
  putStrLn $ "omega period: " ++ show (period omega)
  putStrLn ""
  putStrLn $ "MONAD → Braille: " ++ show (toBraille MONAD)
  putStrLn $ "WLOG → UTF: " ++ show (toUTF WLOG)
  putStrLn $ "toMatrix NOT: " ++ show (toMatrix NOT)
  putStrLn ""
  putStrLn "=== Test: tick sigma7 3 ==="
  putStrLn $ show (tick sigma7 3)
  putStrLn ""
  putStrLn "=== Test: replay MONAD (take 5) ==="
  print $ take 5 (replay MONAD)
  putStrLn ""
  putStrLn "=== PG Example 1: Single person node ==="
  putStrLn pgPerson
  putStrLn ""
  putStrLn "=== PG Example 2: Single relationship edge ==="
  putStrLn pgKnows
  putStrLn ""
  putStrLn "=== PG Example 3: Small 3-node graph ==="
  putStrLn pgSmall3

--------------------------------------------------------------------------------
-- END OF MODULE
--------------------------------------------------------------------------------