'use client'; 
 
 import { useState } from 'react'; 
 
 interface StarTokenProps { 
   balance: number; 
   transactions?: Array<{ 
     id: string; 
     amount: number; 
     type: string; 
     description: string; 
     created_at: string; 
   }>; 
 } 
 
 const earningWays = [ 
   { action: '每日登录', reward: 10, icon: '📅' }, 
   { action: '与怪兽对话', reward: 5, icon: '💬' }, 
   { action: '建造星球', reward: 20, icon: '🌍' }, 
   { action: '进化升级', reward: 50, icon: '⚡' }, 
   { action: '完成创意挑战', reward: 30, icon: '🎨' }, 
   { action: '分享作品', reward: 15, icon: '📤' } 
 ]; 
 
 const spendingWays = [ 
   { item: '新怪兽皮肤', cost: 100, icon: '👕' }, 
   { item: '特殊建筑', cost: 50, icon: '🏰' }, 
   { item: '技能加速', cost: 30, icon: '⏩' }, 
   { item: '星球主题包', cost: 80, icon: '🎭' } 
 ]; 
 
 export default function StarToken({ balance = 0, transactions = [] }: StarTokenProps) { 
   const [activeTab, setActiveTab] = useState<'balance' | 'earn' | 'spend' | 'history'>('balance'); 
 
   return ( 
     <div className="bg-white rounded-xl shadow-lg p-6"> 
       <div className="flex justify-between items-center mb-6"> 
         <h2 className="text-2xl font-bold text-gray-800">⭐ $STAR 代币</h2> 
         <div className="flex gap-2"> 
           {['balance', 'earn', 'spend', 'history'].map(tab => ( 
             <button 
               key={tab} 
               onClick={() => setActiveTab(tab as any)} 
               className={`px-3 py-1 rounded-lg text-sm font-medium ${ 
                 activeTab === tab ? 'bg-yellow-500 text-white' : 'bg-gray-100' 
               }`} 
             > 
               {tab === 'balance' && '余额'} 
               {tab === 'earn' && '赚取'} 
               {tab === 'spend' && '消费'} 
               {tab === 'history' && '记录'} 
             </button> 
           ))} 
         </div> 
       </div> 
 
       {activeTab === 'balance' && ( 
         <div className="text-center py-8"> 
           <div className="text-6xl mb-4">⭐</div> 
           <div className="text-5xl font-bold text-yellow-500 mb-2">{balance}</div> 
           <p className="text-gray-500">$STAR 代币余额</p> 
           <div className="mt-6 flex justify-center gap-4"> 
             <div className="text-center"> 
               <div className="text-2xl font-bold text-green-500">+{transactions.filter(t => t.amount > 0).reduce((a, b) => a + b.amount, 0)}</div> 
               <p className="text-sm text-gray-500">本月收入</p> 
             </div> 
             <div className="text-center"> 
               <div className="text-2xl font-bold text-red-500">-{Math.abs(transactions.filter(t => t.amount < 0).reduce((a, b) => a + b.amount, 0))}</div> 
               <p className="text-sm text-gray-500">本月支出</p> 
             </div> 
           </div> 
         </div> 
       )} 
 
       {activeTab === 'earn' && ( 
         <div className="space-y-3"> 
           <h3 className="font-semibold text-gray-700">赚取方式</h3> 
           {earningWays.map((way, i) => ( 
             <div key={i} className="flex items-center justify-between p-3 bg-green-50 rounded-lg"> 
               <div className="flex items-center gap-3"> 
                 <span className="text-2xl">{way.icon}</span> 
                 <span className="font-medium">{way.action}</span> 
               </div> 
               <span className="font-bold text-green-600">+{way.reward} ⭐</span> 
             </div> 
           ))} 
         </div> 
       )} 
 
       {activeTab === 'spend' && ( 
         <div className="space-y-3"> 
           <h3 className="font-semibold text-gray-700">消费商店</h3> 
           {spendingWays.map((item, i) => ( 
             <div key={i} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg"> 
               <div className="flex items-center gap-3"> 
                 <span className="text-2xl">{item.icon}</span> 
                 <span className="font-medium">{item.item}</span> 
               </div> 
               <button 
                 disabled={balance < item.cost} 
                 className={`px-4 py-2 rounded-lg font-medium ${ 
                   balance >= item.cost 
                     ? 'bg-blue-500 text-white hover:bg-blue-600' 
                     : 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                 }`} 
               > 
                 {item.cost} ⭐ 
               </button> 
             </div> 
           ))} 
         </div> 
       )} 
 
       {activeTab === 'history' && ( 
         <div className="space-y-2 max-h-80 overflow-y-auto"> 
           <h3 className="font-semibold text-gray-700 mb-3">交易记录</h3> 
           {transactions.length === 0 ? ( 
             <p className="text-center text-gray-500 py-8">暂无交易记录</p> 
           ) : ( 
             transactions.map(tx => ( 
               <div key={tx.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"> 
                 <div> 
                   <p className="font-medium">{tx.description || tx.type}</p> 
                   <p className="text-xs text-gray-500">{new Date(tx.created_at).toLocaleDateString()}</p> 
                 </div> 
                 <span className={`font-bold ${tx.amount > 0 ? 'text-green-500' : 'text-red-500'}`}> 
                   {tx.amount > 0 ? '+' : ''}{tx.amount} ⭐ 
                 </span> 
               </div> 
             )) 
           )} 
         </div> 
       )} 
     </div> 
   ); 
 } 
